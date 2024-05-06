import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Video from "../Video/Video";
import useFetchSimilarVideos from "../useFetchSimilarVideos";
import useFetchRecommendVideos from "../useFetchRecommendVideos";
import useLikeCalculation from "../useLikeCalculation";
import { getLikeRatioStyle } from "../Video/Video";
import styles from "./videoSection.module.css";

export default function VideoSection({ sectionType }) {
    const { reference_code } = useParams();
    const { videos, isLoading } = useFetchRecommendVideos();
    const { calculateLikeRatio } = useLikeCalculation();
    const [renderKey, setRenderKey] = useState(0);
    useEffect(() => {
        // pagination
    }, [reference_code, isLoading, videos]);

    const similarVideosObj = useFetchSimilarVideos({ reference_code }); // for similar videos
    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    let view = undefined;

    if (sectionType === "reccommend" && isLoading === false) {
        if (videos) {
            view = (
                <div id={styles.videoSection}>
                    <h2 className={styles.videoSectionH}>Reccommend</h2>
                    {Object.entries(videos).map(([key, video]) => {
                        return (
                            <Video
                                data-testid={`video-${renderKey}`}
                                key={`recommend-${video.video.id}`}
                                videoObj={video}
                            />
                        );
                    })}
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
                                        width={300}
                                        alt="video thumbnail"
                                    />
                                    <p>{videoObj.title}</p>
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
            const userName = videos[0].userName;
            console.log(videos);
            view = (
                <div id={styles.videoSection}>
                    <h2 className={styles.videoSectionH}>{userName} videos</h2>
                    {Object.entries(videos).map(([key, video]) => {
                        return (
                            <Video
                                data-testid={`video-${renderKey}`}
                                key={`otherUser-${video.video.id}`}
                                videoObj={video}
                            />
                        );
                    })}
                </div>
            );
        }
    }

    return view;
}
