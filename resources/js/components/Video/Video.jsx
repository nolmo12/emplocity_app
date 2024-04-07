import React from "react";
import { Link } from "react-router-dom";
import styles from "./video.module.css";

export default function Video() {
    return (
        <section className={styles.videoSection}>
            <Link to="/video:id">
                <div id={styles.video}>
                    <iframe src="https://www.youtube.com/embed/VIDEO_ID"></iframe>
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
