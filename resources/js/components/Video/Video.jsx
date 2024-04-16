import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useFetchVideo from "../useFetchVideo";
import styles from "./video.module.css";

export default function Video({ videoObj }) {
    if (videoObj) {
        const reference_code = videoObj.reference_code;
        const videoThumbnail = videoObj.thumbnail;
        const videoDate = videoObj.created_at.substring(0, 10);
        const videoTitle = videoObj.languages[0].pivot.title;
        const path = `/video/${reference_code}`;
        console.log(videoObj);
        return (
            <section className={styles.videoSection}>
                <Link to={path}>
                    <div id={styles.video}>
                        <img
                            src={videoThumbnail}
                            width={300}
                            alt="video thumbnail"
                        />
                    </div>

                    <div className={styles.videoStat}>
                        <div id={styles.title} className={styles.videoInfo}>
                            {videoTitle}
                        </div>
                        <div className={styles.videoInfo}>author</div>
                        <div id={styles.views} className={styles.videoInfo}>
                            views
                        </div>
                        <div className={styles.videoInfo}>{videoDate}</div>
                        <div id={styles.likes} className={styles.videoInfo}>
                            likes
                        </div>
                    </div>
                </Link>
            </section>
        );
    }
}
