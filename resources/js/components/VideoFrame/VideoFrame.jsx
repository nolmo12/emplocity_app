import React from "react";
import Video from "../Video/Video";
import styles from "./videoFrame.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faUser,
    faThumbsUp,
    faThumbsDown,
    faShare
} from "@fortawesome/free-solid-svg-icons";

export default function VideoFrame() {
    return (
        <>
            <div className={styles.videoFrameDiv}>
                <iframe
                    className={styles.videoFrame}
                    src="https://www.youtube.com/embed/bWFiSfEyZV4?si=7IxFnJIEmlCFcRAy"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen
                ></iframe>
                <div className={styles.videoFrameInfo}>
                    <FontAwesomeIcon icon={faShare} className={styles.videoFrameIcon}/>
                    <FontAwesomeIcon icon={faThumbsDown} className={styles.videoFrameIconTD}/>
                    <FontAwesomeIcon icon={faThumbsUp} className={styles.videoFrameIcon}/>
                    <h1 className={styles.videoFrameInfoTitle}>Title</h1>
                    <h1><FontAwesomeIcon icon={faUser} /> Account</h1>
                    <h1 className={styles.videoFrameInfoDesc} >Description</h1>
                </div>
            </div>

            <div className={styles.videoFrameReccomend}>
                <Video className={styles.videoFrameReccomendMin}/>
                <Video className={styles.videoFrameReccomendMin}/>
                <Video className={styles.videoFrameReccomendMin}/>
            </div>
        </>
    );
}
