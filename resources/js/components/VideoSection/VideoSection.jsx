import React from "react";
import { useState } from "react";
import Video from "../Video/Video";
import useFetchVideo from "../useFetchVideos";
import styles from "./videoSection.module.css";

export default function VideoSection() {
    const videos = useFetchVideo("/api/storage/videos");
    return (
        <div id={styles.videoSection}>
            <h2 className={styles.videoSectionH}>Reccommend</h2>
            {videos.map((key, video) => (
                <Video key={key} video={video} />
            ))}
            {/* <Video />
            <Video />
            <Video /> */}
        </div>
    );
}
