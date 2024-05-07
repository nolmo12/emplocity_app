import React, { useState, useEffect } from "react";
import authUser from "../authUser";
import { Link } from "react-router-dom";
import styles from "./userVideoSection.module.css";
import { ClipLoader } from "react-spinners";

export default function UserVideoSection() {
    const [videosObj, setVideosObj] = useState([]);
    const { http, getUser } = authUser();

    useEffect(() => {
        fetchUserId();
    }, []);

    const fetchUserId = async () => {
        const user = await getUser();
        console.log(user);
        fetchUserVideos(user.id);
    };

    const fetchUserVideos = async (id) => {
        const response = await http.get(`/api/auth/read/${id}`);
        setVideosObj(response.data);
        console.log(response.data);
    };

    const handleClickRemove = async (reference_code) => {
        console.log(reference_code);
        await http.delete(`/api/video/delete/`, {
            reference_code: reference_code,
        });
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
                    {videosObj.videos &&
                        videosObj.videos.map((video) => {
                            const path = `/video/${video.video.reference_code}`;
                            return (
                                <tr key={video.video.id}>
                                    <td>
                                        <Link to={path}>
                                            <img
                                                src={video.video.thumbnail}
                                                alt="thumbnail"
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
                                    <td>
                                        <button
                                            onClick={() =>
                                                handleClickRemove(
                                                    video.video.reference_code
                                                )
                                            }
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
}
