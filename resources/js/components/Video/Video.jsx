import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useFetchVideo from "../useFetchVideo";
import styles from "./video.module.css";

export default function Video({ tempVideo }) {
    const { reference_code } = tempVideo;
    const { video } = useFetchVideo({ reference_code });

    if (video) {
        console.log(video);
        const videoPath = video.video;
        const videoThumbnail = video.thumbnail;
        const path = `/video/${reference_code}`;
        return (
            <section className={styles.videoSection}>
                <Link to={path}>
                    <div id={styles.video}>
                        <video
                            width={320}
                            src={videoPath}
                            poster={videoThumbnail}
                            controls
                        ></video>
                        <div id={styles.title} className={styles.videoInfo}>
                            {" "}
                            title{" "}
                        </div>
                        <div className={styles.videoInfo}> author </div>
                        <div id={styles.views} className={styles.videoInfo}>
                            {" "}
                            views{" "}
                        </div>
                        <div className={styles.videoInfo}> date </div>
                        <div id={styles.likes} className={styles.videoInfo}>
                            {" "}
                            likes{" "}
                        </div>
                    </div>
                </Link>
            </section>
        );
    }
}
