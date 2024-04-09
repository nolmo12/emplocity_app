import React from "react";
import { useParams } from "react-router-dom";
import useFetchVideo from "../useFetchVideo";
import styles from "./videoFrame.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faThumbsUp,
    faThumbsDown,
    faShare,
} from "@fortawesome/free-solid-svg-icons";

export default function VideoFrame() {
    const { reference_code } = useParams();
    const videoObj = useFetchVideo({ reference_code });
    if (videoObj && videoObj.video) {
        const videoTitle = videoObj.title;
        const videoPath = videoObj.video.video;
        const videoThumbnail = videoObj.video.thumbnail;
        console.log(videoObj);
        return (
            <>
                <div className={styles.videoFrameDiv}>
                    <video
                        src={videoPath}
                        poster={videoThumbnail}
                        controls
                    ></video>
                    <div className={styles.videoFrameInfo}>
                        <FontAwesomeIcon
                            icon={faShare}
                            className={styles.videoFrameIcon}
                        />
                        <FontAwesomeIcon
                            icon={faThumbsDown}
                            className={styles.videoFrameIconTD}
                        />
                        <FontAwesomeIcon
                            icon={faThumbsUp}
                            className={styles.videoFrameIcon}
                        />
                        <h1 className={styles.videoFrameInfoTitle}>
                            {videoTitle}
                        </h1>
                        <h1>
                            <FontAwesomeIcon icon={faUser} /> Account
                        </h1>
                        <h1 className={styles.videoFrameInfoDesc}>
                            Description
                        </h1>
                    </div>
                </div>

                {/* <div className={styles.videoFrameReccomend}>
                    <Video className={styles.videoFrameReccomendMin} />
                    <Video className={styles.videoFrameReccomendMin} />
                    <Video className={styles.videoFrameReccomendMin} />
                </div> */}
            </>
        );
    }
}
