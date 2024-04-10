import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useFetchVideo from "../useFetchVideo";
import useLike from "../useLike";
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
    const like = useLike({ reference_code, likeType: 1 });
    const disLike = useLike({ reference_code, likeType: 0 });
    const [renderKey, setRenderKey] = useState(0);
    useEffect(() => {
        setRenderKey((prev) => prev + 1);
    }, [reference_code]);

    function handleLike(e) {
        console.log(like);
    }

    if (videoObj && videoObj.video) {
        const videoTitle = videoObj.title;
        const videoPath = videoObj.video.video;
        const videoThumbnail = videoObj.video.thumbnail;
        return (
            <>
                <div className={styles.videoFrameDiv}>
                    <video
                        width={320}
                        src={videoPath}
                        poster={videoThumbnail}
                        controls
                        className={styles.videoScreen}
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
                            onClick={(e) => handleLike(e)}
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
            </>
        );
    }
}
