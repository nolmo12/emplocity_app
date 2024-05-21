import React, { useState, useEffect } from "react";
import authUser from "../authUser";
import { Link } from "react-router-dom";
import styles from "./userVideoSection.module.css";
import useUser from "../useUser";
import { ClipLoader } from "react-spinners";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";

export default function UserVideoSection() {
    const [visibleMenu, setVisibleMenu] = useState(null);
    const [videosObj, setVideosObj] = useState([]);
    const [renderKey, setRenderKey] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const { http } = authUser();
    const { getUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserId();
    }, [renderKey]);

    const fetchUserId = async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        const user = await getUser();
        fetchUserVideos(user.id);
    };

    const fetchUserVideos = async (id) => {
        const response = await http.get(`/api/auth/read/${id}`);
        setVideosObj(response.data);
    };

    // const handleClickRemove = async (reference_code) => {
    //     await http.delete(`/api/video/delete`, {
    //         params: { reference_code: reference_code },
    //     });
    //     setRenderKey((prev) => prev + 1);
    // };

    const toggleMenu = (id) => {
        setVisibleMenu(visibleMenu === id ? null : id);
    };

    return (
        <div id={styles.UserVideoSection}>
            <table data-testid="userVideoTable">
                <thead>
                    <tr>
                        <th id={styles.VideoHeader}>My video</th>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Views</th>
                        <th>Comments</th>
                        <th>Likes</th>
                        <th>Dislikes</th>
                    </tr>
                </thead>
                <tbody>
                    {videosObj.videos ? (
                        videosObj.videos.map((video) => {
                            const path = `/video/${video.video.reference_code}`;
                            const menuId = video.video.id;
                            return (
                                <tr key={menuId} className={styles.tableRow}>
                                    <td>
                                        {!imageLoaded && (
                                            <ClipLoader color="#000" />
                                        )}
                                        <Link to={path}>
                                            <img
                                                src={video.video.thumbnail}
                                                alt="thumbnail"
                                                onLoad={() =>
                                                    setImageLoaded(true)
                                                }
                                            />
                                        </Link>
                                    </td>
                                    <td className={styles.tdContent}>
                                        {video.title}
                                    </td>
                                    <td className={styles.tdContent}>
                                        {video.video.created_at.substring(
                                            0,
                                            10
                                        )}
                                    </td>
                                    <td className={styles.tdContent}>
                                        {video.video.views}
                                    </td>
                                    <td className={styles.tdContent}>
                                        {video.commentCount}
                                    </td>
                                    <td className={styles.tdContent}>
                                        {video.likesCount}
                                    </td>
                                    <td className={styles.tdContent}>
                                        {video.dislikesCount}
                                    </td>

                                    <td className={styles.tdContent}>
                                        <div className={styles.editVideoMenu}>
                                            <FontAwesomeIcon
                                                icon={faEllipsisV}
                                                className={styles.userVideoIcon}
                                                onClick={() => toggleMenu(menuId)}
                                            />
                                            <div
                                                className={`${styles.buttonsContainer} ${
                                                    visibleMenu === menuId ? styles.menuVisible : ""
                                                }`}
                                            >
                                                <button
                                            onClick={() =>
                                                navigate(
                                                    `/video-settings/${video.video.reference_code}`
                                                )
                                            }
                                        >
                                            Edit video
                                        </button>
                                            </div>
                                        </div>

                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <ClipLoader color="#000" size={200} />
                    )}
                </tbody>
            </table>
        </div>
    );
}
