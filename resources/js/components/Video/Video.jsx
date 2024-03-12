import React from "react";
import styles from "./video.module.css";
export default function Video() {
    return (
        <section>
            <div id={styles.video}>
                <iframe></iframe>
                <div id={styles.title}> title </div>
                <div id={styles.author}> author </div>
                <div id={styles.views}> views </div>
                <div id={styles.date}> date </div>
                <div id={styles.likes}> likes </div>
            </div>
        </section>
    );
}
