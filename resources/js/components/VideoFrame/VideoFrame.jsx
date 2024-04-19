import React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Comments from "../Comments/Comments";
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
    const [likesCount, setLikesCount] = useState(0);
    const [dislikesCount, setDislikesCount] = useState(0);
    const [userInteraction, setUserInteraction] = useState();
    const [thumbStyle, setThumbStyle] = useState();
    const [initialThumbStyle, setInitialThumbStyle] = useState();
    const [renderKey, setRenderKey] = useState(0);
    console.log(thumbStyle);
    const fetchLikeInfo = async () => {
        try {
            const likeInfo = await fetchLikes(
                reference_code,
                setInitialThumbStyle
            );

            setUserInteraction(likeInfo);
            if (likeInfo === 1) {
                setThumbStyle("like");
            }
            if (likeInfo === 0) {
                setThumbStyle("dislike");
            }
            if (likeInfo === null) {
                setThumbStyle(null);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setRenderKey((prev) => prev + 1);

        setUserInteraction(null);
        setThumbStyle("");

        if (videoObj) {
            setLikesCount(videoObj.likesCount);
            setDislikesCount(videoObj.dislikesCount);
        }

        fetchLikeInfo();
    }, [reference_code, videoObj]);

    if (!isLoading) {
        const videoTitle = videoObj.title;
        const videoPath = videoObj.video.video;
        const videoDescription = videoObj.description;
        const videoThumbnail = videoObj.video.thumbnail;
        const videoOwner = videoObj.userName;
        console.log("-----------------------");
        console.log("userInteraction", userInteraction);
        console.log("thumbStyle", thumbStyle);
        console.log("initialThumbStyle", initialThumbStyle);
        console.log("likesCount", likesCount);
        console.log("dislikesCount", dislikesCount);
        console.log("reference_code", reference_code);

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
                        <div className={styles.videoLDContainer}>
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
                                        setUserInteraction,
                                        setThumbStyle
                                    )
                                } // 0 for dislike
                                icon={faThumbsDown}
                                data-testid="dislike-button"
                                className={`${styles.videoFrameIconTD} ${
                                    thumbStyle === "dislike" && styles.dislike
                                }`}
                            />
                            <p>{dislikesCount}</p>
                        </div>

                        <div className={styles.videoLDContainer}>
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
                                        setUserInteraction,
                                        setThumbStyle
                                    )
                                } // 1 for like
                                icon={faThumbsUp}
                                data-testid="like-button"
                                className={`${styles.videoFrameIcon} ${
                                    thumbStyle === "like" && styles.like
                                }`}
                            />
                            <p>{likesCount}</p>
                        </div>

                        <h1 className={styles.videoFrameInfoTitle}>
                            <p data-testid="video-title">{videoTitle}</p>
                        </h1>
                        <h1>
                            <FontAwesomeIcon icon={faUser} />{" "}
                            {videoOwner ? (
                                <p data-testid="video-owner">{videoOwner}</p>
                            ) : (
                                <p data-testid="video-owner">Guest</p>
                            )}
                        </h1>
                        <h1 className={styles.videoFrameInfoDesc}>
                            {videoDescription ? (
                                <p data-testid="video-description">
                                    {videoDescription}
                                </p>
                            ) : (
                                <p data-testid="video-description">
                                    No description
                                </p>
                            )}
                        </h1>
                    </div>
                </div>
                <Comments reference_code={reference_code} />
            </>
        );
    }
}
