import React from "react";
import Video from "../Video/Video";
import styles from "./videoSection.module.css";

export default function VideoSection() {
    return (
        <div id={styles.videoSection}>
            <h2 className={styles.videoSectionH}>Reccommend</h2>
            <Video />
            <Video />
            <Video />
        </div>
    );
}
