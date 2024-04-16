import React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import useFetchVideo from "../useFetchVideo";
import authUser from "../authUser";
import useLikeCalculation from "../useLikeCalculation";
import useLike from "../useLike";
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
    const { likeCountFunction } = useLikeCalculation();
    const { fetchLikes, sendLikes } = useLike();
    const { reference_code } = useParams();
    const { videoObj, isLoading } = useFetchVideo({ reference_code });

    // const [userThumb, setUserThumb] = useState();
    const [likesCount, setLikesCount] = useState(0);
    const [dislikesCount, setDislikesCount] = useState(0);
    const [userInteraction, setUserInteraction] = useState();

    const [renderKey, setRenderKey] = useState(0);

    useEffect(() => {
        setRenderKey((prev) => prev + 1);

        if (videoObj) {
            setLikesCount(videoObj.likesCount);
            setDislikesCount(videoObj.dislikesCount);
        }
        const getLikeInfo = async () => {
            try {
                const likeInfo = await fetchLikes(reference_code);
                setUserInteraction(likeInfo);
            } catch (error) {
                console.log(error);
            }
        };

        getLikeInfo();
    }, [reference_code, videoObj]);

    if (!isLoading) {
        console.log(videoObj);
        const videoTitle = videoObj.title;
        const videoPath = videoObj.video.video;
        const videoDescription = videoObj.description;
        const videoThumbnail = videoObj.video.thumbnail;
        return (
            <>
                <div
                    className={styles.videoFrameDiv}
                    data-testid="video-player"
                >
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
                        <div>
                            <FontAwesomeIcon
                                onClick={() =>
                                    likeCountFunction(
                                        0,
                                        likesCount,
                                        setLikesCount,
                                        dislikesCount,
                                        setDislikesCount,
                                        reference_code,
                                        userInteraction,
                                        setUserInteraction
                                    )
                                } // 0 for dislike
                                icon={faThumbsDown}
                                className={styles.videoFrameIconTD}
                            />
                            <p>{dislikesCount}</p>
                        </div>

                        <div>
                            <FontAwesomeIcon
                                onClick={() =>
                                    likeCountFunction(
                                        1,
                                        likesCount,
                                        setLikesCount,
                                        dislikesCount,
                                        setDislikesCount,
                                        reference_code,
                                        userInteraction,
                                        setUserInteraction
                                    )
                                } // 1 for like
                                icon={faThumbsUp}
                                className={styles.videoFrameIcon}
                            />
                            <p>{likesCount}</p>
                        </div>

                        <h1 className={styles.videoFrameInfoTitle}>
                            {videoTitle}
                        </h1>
                        <h1>
                            <FontAwesomeIcon icon={faUser} /> Account
                        </h1>
                        <h1 className={styles.videoFrameInfoDesc}>
                            Description
                        </h1>
                        {videoDescription && (
                            <p color="black">{videoDescription}</p>
                        )}
                    </div>
                </div>
            </>
        );
    }
}
