import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Video from "../Video/Video";
import useFetchSimilarVideos from "../useFetchSimilarVideos";
import useFetchRecommendVideos from "../useFetchRecommendVideos";
import useLikeCalculation from "../useLikeCalculation";
import styles from "./videoSection.module.css";

export default function VideoSection({ sectionType }) {
    const { reference_code } = useParams();
    const { videos, isLoading } = useFetchRecommendVideos();
    const { calculateLikeRatio } = useLikeCalculation();
    const [renderKey, setRenderKey] = useState(0);
    useEffect(() => {
        console.log("isLoading:", isLoading);
        console.log("videos:", videos);
        // pagination
    }, [reference_code, isLoading, videos]);

    const similarVideosObj = useFetchSimilarVideos({ reference_code }); // for similar videos
    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    let view = undefined;

    if (sectionType === "reccommend" && isLoading === false) {
        if (videos) {
            console.log(videos);
            view = (
                <div id={styles.videoSection}>
                    <h2 className={styles.videoSectionH}>Reccommend</h2>
                    {Object.entries(videos).map(([key, video]) => {
                        return (
                            <Video
                                data-testid={`video-${renderKey}`}
                                key={video.id}
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
                                        {calculateLikeRatio(
                                            videoObj.likesCount,
                                            videoObj.dislikesCount
                                        )}
                                    </p>
                                </div>
                            </Link>
                        );
                    }
                )}
            </div>
        );
    }

    return view;
}
