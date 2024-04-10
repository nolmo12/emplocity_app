import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Video from "../Video/Video";
import MainContent from "../MainContent/MainContent";
import useFetchSimilarVideos from "../useFetchSimilarVideos";
import useFetchAllVideos from "../useFetchAllVideos";
import styles from "./videoSection.module.css";

export default function VideoSection({ sectionType }) {
    const { reference_code } = useParams();
    const { videos, isLoading } = useFetchAllVideos();
    const [renderKey, setRenderKey] = useState(0);

    useEffect(() => {
        setRenderKey((prev) => prev + 1);
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
                {videos.map((video) => {
                    return <Video key={video.id} videoObj={video} />;
                })}
            </div>
        );
    } else if (sectionType === "similar" && similarVideosObj.videos) {
        view = (
            <div>
                {Object.entries(similarVideosObj.videos).map(([key, video]) => {
                    const path = `/video/${video.reference_code}`;
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
