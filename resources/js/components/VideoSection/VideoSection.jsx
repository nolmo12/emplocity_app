import React from "react";
import { useState } from "react";
import Video from "../Video/Video";
import useFetchAllVideos from "../useFetchAllVideos";
import styles from "./videoSection.module.css";

export default function VideoSection() {
    const { videos, isLoading } = useFetchAllVideos();
    if (isLoading) {
        return <h1>Loading...</h1>;
    }
    return (
        <div id={styles.videoSection}>
            <h2 className={styles.videoSectionH}>Reccommend</h2>
            {videos.map((video) => {
                return <Video key={video.id} videoObj={video} />;
            })}
        </div>
    );
}
