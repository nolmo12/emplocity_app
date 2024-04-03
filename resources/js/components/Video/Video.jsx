import React from "react";
import styles from "./video.module.css";

export default function Video() {
    return (
        <section>
            <div id={styles.video}>
                <iframe></iframe>
                <div id={styles.title} className={styles.videoInfo}> title </div>
                <div className={styles.videoInfo}> author </div>
                <div id={styles.views} className={styles.videoInfo}> views </div>
                <div className={styles.videoInfo}> date </div>
                <div id={styles.likes} className={styles.videoInfo}> likes </div>
            </div>
        </section>
    );
}
