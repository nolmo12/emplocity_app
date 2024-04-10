import React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import useFetchVideo from "../useFetchVideo";
import useLike from "../useLike";
import authUser from "../authUser";
import styles from "./videoFrame.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faThumbsUp,
    faThumbsDown,
    faShare,
} from "@fortawesome/free-solid-svg-icons";
import { copySelection } from "@testing-library/user-event/dist/cjs/document/copySelection.js";

export default function VideoFrame() {
    const { http } = authUser();
    const { reference_code } = useParams();
    const videoObj = useFetchVideo({ reference_code });
    const [likesCount, setLikesCount] = useState(0);
    const user = useRef();
    const [dislikesCount, setDislikesCount] = useState(0);

    const [renderKey, setRenderKey] = useState(0);

    useEffect(() => {
        setRenderKey((prev) => prev + 1);
        if (videoObj) {
            setLikesCount(videoObj.likesCount);
            setDislikesCount(videoObj.dislikesCount);
        }
    }, [reference_code, videoObj]);

    const likeCount = async (likeType) => {
        if (likeType === 1) {
            setLikesCount((prev) => prev + 1);
        } else if (likeType === 0) {
            setDislikesCount((prev) => prev + 1);
        }
    };

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
                            onClick={() => likeCount(0)} // 0 for dislike
                            icon={faThumbsDown}
                            className={styles.videoFrameIconTD}
                        />
                        <p>{dislikesCount}</p>

                        <FontAwesomeIcon
                            onClick={() => likeCount(1)} // 1 for like
                            icon={faThumbsUp}
                            className={styles.videoFrameIcon}
                        />
                        <p>{likesCount}</p>

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
