import React from "react";
import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import _ from "lodash";
import Video from "../Video/Video";
import useFetchSimilarVideos from "../useFetchSimilarVideos";
import useFetchRecommendVideos from "../useFetchRecommendVideos";
import useLikeCalculation from "../useLikeCalculation";
import useUser from "../useUser";
import { getLikeRatioStyle } from "../Video/Video";
import styles from "./videoSection.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMinus } from "@fortawesome/free-solid-svg-icons";

export default function VideoSection({ sectionType }) {
    const { reference_code } = useParams();
    const [pageNumber, setPageNumber] = useState(1);
    const [adminFlag, setAdminFlag] = useState(false);
    const username = useRef("");
    const [hasScrolledPast85, setHasScrolledPast85] = useState(false);
    const { videos, isLoading, fetchNextVideos, tagCount } =
        useFetchRecommendVideos({
            pageNumber,
        });
    const previousScroll = useRef(0);
    const [noMoreVideosFlag, setNoMoreVideosFlag] = useState(false);
    const { removeUser, isAdmin } = useUser();
    const { calculateLikeRatio } = useLikeCalculation();
    const { tag } = useParams();
    const { userId } = useParams();
    const [testKey] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        checkAdminFlag();
    }, [userId]);

    const checkAdminFlag = async () => {
        const response = await isAdmin();
        if (response === true) {
            setAdminFlag(true);
        } else {
            setAdminFlag(false);
        }
    };

    const removeUserAndNavigate = async (id, flag) => {
        await removeUser(id, flag);
        navigate("/account");
    };

    const similarVideosObj = useFetchSimilarVideos({
        reference_code,
        pageNumber,
    }); // for similar videos

    const handleScroll = _.throttle((event) => {
        if (sectionType === "reccommend") {
            const target = event.target;
            const currentScroll = target.scrollTop;
            const scrollPercentage =
                (target.scrollTop /
                    (target.scrollHeight - target.clientHeight)) *
                100;
            if (previousScroll.current < currentScroll) {
                if (scrollPercentage > 85 && !hasScrolledPast85) {
                    const tempNumber = pageNumber + 1;
                    setPageNumber((prev) => prev + 1);
                    fetchNextVideos(
                        tempNumber,
                        noMoreVideosFlag,
                        setNoMoreVideosFlag
                    );
                    setHasScrolledPast85(true);
                } else if (scrollPercentage < 85) {
                    setHasScrolledPast85(false);
                }
            }
            previousScroll.current = currentScroll;
        }
    }, 1500);

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    let view = undefined;

    if (sectionType === "reccommend" && isLoading === false) {
        if (videos) {
            view = (
                <div id={styles.videoSection} onScroll={handleScroll}>
                    <div className={styles.videoSectionHContainer}>
                        <h2 className={styles.videoSectionH}>Recommended</h2>
                    </div>
                    <div className={styles.videoSectionList}>
                        {Object.entries(videos).map(([key, video]) => {
                            return (
                                <Video
                                    data-testid={`video-${testKey}`}
                                    key={`recommend-${video.video.id}`}
                                    videoObj={video}
                                />
                            );
                        })}
                    </div>
                </div>
            );
        }
    } else if (sectionType === "similar" && similarVideosObj.videos) {
        view = (
            <div className={styles.similarVideo}>
                {Object.entries(similarVideosObj.videos).map(
                    ([key, videoObj]) => {
                        const path = `/video/${videoObj.video.reference_code}`;
                        const likeRatio = calculateLikeRatio(
                            videoObj.likesCount,
                            videoObj.dislikesCount
                        );
                        const ratingStyle = getLikeRatioStyle(likeRatio);
                        return (
                            <Link key={key} to={path}>
                                <div id={styles.video}>
                                    <img
                                        src={videoObj.video.thumbnail}
                                        alt="video thumbnail"
                                    />
                                    <p className={styles.videoTitle}>
                                        {videoObj.title}
                                    </p>
                                    <p>
                                        Rating:{" "}
                                        <span
                                            style={{ color: ratingStyle.color }}
                                        >
                                            {likeRatio}
                                        </span>
                                    </p>
                                </div>
                            </Link>
                        );
                    }
                )}
            </div>
        );
    } else if (sectionType === "otherAccount") {
        if (videos) {
            if (videos.length > 0) {
                username.current = videos[0].userName;
            } else {
                username.current = "No videos";
            }
            view = (
                <>
                    {adminFlag === true && (
                        <button
                            onClick={() => removeUserAndNavigate(userId, true)}
                            className={styles.adminButton}
                        >
                            <FontAwesomeIcon icon={faUserMinus} className={styles.removeUserIcon}/>
                            Remove user
                        </button>
                    )}
                    <div id={styles.videoSection} onScroll={handleScroll}>
                        <div className={styles.videoSectionHContainer}>
                            <h2 className={styles.videoSectionH}>
                                {username.current}
                            </h2>
                        </div>
                        <div className={styles.videoSectionList}>
                            {Object.entries(videos).map(([key, video]) => {
                                return (
                                    <Video
                                        data-testid={`video-${testKey}`}
                                        key={`otherUser-${video.video.id}`}
                                        videoObj={video}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </>
            );
        }
    } else if (sectionType === "tag") {
        if (videos) {
            view = (
                <div id={styles.videoSection} onScroll={handleScroll}>
                    <div className={styles.videoSectionHContainer}>
                        <h2 className={styles.videoSectionH}>
                            Videos with tag #{tag} {tagCount}
                        </h2>
                    </div>
                    <div className={styles.videoSectionList}>
                        {Object.entries(videos).map(([key, video]) => {
                            return (
                                <Video
                                    data-testid={`video-${testKey}`}
                                    key={`tag-${video.video.id}`}
                                    videoObj={video}
                                />
                            );
                        })}
                    </div>
                </div>
            );
        }
    }

    return view;
}
