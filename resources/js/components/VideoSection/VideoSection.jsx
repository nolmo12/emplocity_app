import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import _ from "lodash";
import Video from "../Video/Video";
import useFetchSimilarVideos from "../useFetchSimilarVideos";
import useFetchRecommendVideos from "../useFetchRecommendVideos";
import useLikeCalculation from "../useLikeCalculation";
import { getLikeRatioStyle } from "../Video/Video";
import styles from "./videoSection.module.css";

export default function VideoSection({ sectionType }) {
    const { reference_code } = useParams();
    const [pageNumber, setPageNumber] = useState(1);
    const [hasScrolledPast85, setHasScrolledPast85] = useState(false);
    const { videos, isLoading, fetchNextVideos } = useFetchRecommendVideos({
        pageNumber,
    });
    const { calculateLikeRatio } = useLikeCalculation();
    const { tag } = useParams();
    const { userId } = useParams();
    const [renderKey, setRenderKey] = useState(0);

    // useEffect(() => {}, [
    //     reference_code,
    //     isLoading,
    //     videos,
    //     userId,
    //     pageNumber,
    // ]);

    const similarVideosObj = useFetchSimilarVideos({
        reference_code,
        pageNumber,
    }); // for similar videos

    const handleScroll = _.throttle((event) => {
        if (sectionType === "reccommend") {
            const target = event.target;
            const scrollPercentage =
                (target.scrollTop /
                    (target.scrollHeight - target.clientHeight)) *
                100;

            if (scrollPercentage > 85 && !hasScrolledPast85) {
                const tempNumber = pageNumber + 1;
                setPageNumber((prev) => prev + 1);
                fetchNextVideos(tempNumber);
                console.log("Scrollbar 80% event");
            } else if (scrollPercentage < 85) {
                setHasScrolledPast85(false);
            }
            // potentially rework
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
            let userName = "";
            if (videos.length > 0) {
                userName = videos[0].userName;
                console.log(userName);
            }
            view = (
                <div id={styles.videoSection} onScroll={handleScroll}>
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
    } else if (sectionType === "tag") {
        if (videos) {
            view = (
                <div id={styles.videoSection} onScroll={handleScroll}>
                    <h2 className={styles.videoSectionH}>#{tag} videos</h2>
                    {Object.entries(videos).map(([key, video]) => {
                        return (
                            <Video
                                data-testid={`video-${renderKey}`}
                                key={`tag-${video.video.id}`}
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
