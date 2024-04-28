import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Video from "../Video/Video";
import useFetchSimilarVideos from "../useFetchSimilarVideos";
import useFetchAllVideos from "../useFetchAllVideos";
import styles from "./videoSection.module.css";

export default function VideoSection({ sectionType }) {
    const { reference_code } = useParams();
    const { videos, isLoading } = useFetchAllVideos();
    const [renderKey, setRenderKey] = useState(0);

    useEffect(() => {
        // pagination
        const handleScroll = () => {
            const halfwayDown = document.body.scrollHeight / 2;

            if (window.scrollY >= halfwayDown) {
                console.log("User has scrolled halfway down the page");
            }
        };
        window.addEventListener("scroll", handleScroll);
        setRenderKey((prev) => prev + 1);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [reference_code]);

    const similarVideosObj = useFetchSimilarVideos({ reference_code }); // for similar videos
    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    let view = undefined;

    if (sectionType === "reccommend") {
        view = (
            <div id={styles.videoSection}>
                <h2 className={styles.videoSectionH}>Reccommend</h2>

                {videos &&
                    videos.map((video) => {
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
    } else if (sectionType === "similar" && similarVideosObj.videos) {
        view = (
            <div className={styles.similarVideo}>
                {Object.entries(similarVideosObj.videos).map(([key, video]) => {
                    const path = `/video/${video.video.reference_code}`;
                    return (
                        <Link key={key} to={path}>
                            <div id={styles.video}>
                                <img
                                    src={video.thumbnail}
                                    width={300}
                                    alt="video thumbnail"
                                />
                                <p>{video.title}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        );
    }
    return view;
}
