import React from "react";
import { useState, useEffect } from "react";
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

export default function VideoFrame() {
    const { reference_code } = useParams();
    const videoObj = useFetchVideo({ reference_code });
    const [likesCount, setLikesCount] = useState(0);
    const [dislikesCount, setDislikesCount] = useState(0);
    const [userThumbsTrack, setUserThumbsTrack] = useState(false);
    const [likeIsClicked, setLikeIsClicked] = useState(false);
    const [dislikeIsClicked, setDislikeIsClicked] = useState(false);
    const { http } = authUser();
    const [renderKey, setRenderKey] = useState(0);

    useEffect(() => {
        setRenderKey((prev) => prev + 1);
        if (videoObj) {
            setLikesCount(videoObj.likesCount);
            setDislikesCount(videoObj.dislikesCount);
        }
    }, [reference_code, videoObj]);

    const likeCount = async (likeType) => {
        try {
            const response = await http.post(
                `/api/video/like/${reference_code}`,
                {
                    like_dislike: likeType,
                }
            );
            if (!userThumbsTrack) {
                if (likeType === 1) {
                    setLikesCount(likesCount + 1);
                    setLikeIsClicked(true);
                    setUserThumbsTrack(true);
                } else {
                    setDislikesCount(dislikesCount + 1);
                    setDislikeIsClicked(true);
                    setUserThumbsTrack(true);
                }
            }
            if (userThumbsTrack) {
                if (likeType === 1 && likeIsClicked) {
                    setLikesCount(likesCount - 1);
                    setLikeIsClicked(false);
                    setUserThumbsTrack(false);
                } else if (
                    likeType === 0 &&
                    videoObj.dislikesCount > 0 &&
                    dislikeIsClicked
                ) {
                    setDislikesCount(dislikesCount - 1);
                    setDislikeIsClicked(false);
                    setUserThumbsTrack(false);
                }
            }
        } catch (error) {
            console.log(error);
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
