import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Comments from "../Comments/Comments";
import useFetchVideo from "../useFetchVideo";
import authUser from "../authUser";
import useLikeCalculation from "../useLikeCalculation";
import useFetchVideosSearch from "../useFetchVideosSearch";
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
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function VideoFrame() {
    const { http, isLogged } = authUser();
    const { sendToHistory } = useFetchVideosSearch();
    const { likeCountFunction } = useLikeCalculation();
    const { fetchLikes, sendLikes } = useLike();
    const { reference_code } = useParams();
    const { videoObj, isLoading } = useFetchVideo({ reference_code });
    const [likesCount, setLikesCount] = useState(0);
    const [dislikesCount, setDislikesCount] = useState(0);
    const [shareIsClicked, setShareIsClicked] = useState(false);
    const [renderKey, setRenderKey] = useState(0);
    const [thumbObj, setThumbObj] = useState({
        like: false,
        dislike: false,
        userInteraction: null,
        thumbStyle: null,
    });

    useEffect(() => {
        sendToHistory(reference_code);
        setThumbObj({
            like: false,
            dislike: false,
            userInteraction: null,
            thumbStyle: null,
        });
        setRenderKey((prev) => prev + 1);

        if (videoObj) {
            setLikesCount(videoObj.likesCount);
            setDislikesCount(videoObj.dislikesCount);
        }
        fetchLikeInfo();
    }, [reference_code, videoObj]);

    const fetchLikeInfo = async () => {
        if (!isLogged) {
            console.log("User is not logged in. Cannot fetch likes.");
            return;
        }
        try {
            const likeInfo = await fetchLikes(reference_code);
            if (likeInfo || likeInfo === 0) {
                if (likeInfo === 1) {
                    setThumbObj({
                        like: true,
                        dislike: false,
                        userInteraction: "like",
                        thumbStyle: "like",
                    });
                } else if (likeInfo === 0) {
                    setThumbObj({
                        like: false,
                        dislike: true,
                        userInteraction: "dislike",
                        thumbStyle: "dislike",
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleShareClick = (e) => {
        setShareIsClicked(true);
    };

    if (!isLoading) {
        const videoTitle = videoObj.title;
        const videoPath = videoObj.video.video;
        const videoDescription = videoObj.description;
        const videoThumbnail = videoObj.video.thumbnail;
        const videoOwner = videoObj.userName;
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
                        <Popup
                            trigger={
                                <FontAwesomeIcon
                                    icon={faShare}
                                    className={styles.videoFrameIcon}
                                    onClick={handleShareClick}
                                />
                            }
                            position="center"
                            modal
                            className={styles.customPopup}
                        >
                            {(close) => (
                                <div className={styles.sharePopup}>
                                    <p>
                                        {JSON.stringify(videoObj.video.video)}
                                    </p>
                                    <button
                                        onClick={() => {
                                            setShareIsClicked(false);
                                            close();
                                        }}
                                    >
                                        Ok
                                    </button>
                                </div>
                            )}
                        </Popup>
                        <div className={styles.videoLDContainer}>
                            <FontAwesomeIcon
                                onClick={() =>
                                    likeCountFunction(
                                        0,
                                        thumbObj,
                                        setThumbObj,
                                        reference_code,
                                        likesCount,
                                        dislikesCount,
                                        setLikesCount,
                                        setDislikesCount
                                    )
                                } // 0 for dislike
                                icon={faThumbsDown}
                                data-testid="dislike-button"
                                className={`${styles.videoFrameIconTD} ${
                                    thumbObj.thumbStyle === "dislike" &&
                                    styles.dislike
                                }`}
                            />
                            <p>{dislikesCount}</p>
                        </div>

                        <div className={styles.videoLDContainer}>
                            <FontAwesomeIcon
                                onClick={() =>
                                    likeCountFunction(
                                        1,
                                        thumbObj,
                                        setThumbObj,
                                        reference_code,
                                        likesCount,
                                        dislikesCount,
                                        setLikesCount,
                                        setDislikesCount
                                    )
                                } // 1 for like
                                icon={faThumbsUp}
                                data-testid="like-button"
                                className={`${styles.videoFrameIcon} ${
                                    thumbObj.thumbStyle === "like" &&
                                    styles.like
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
                    <Comments reference_code={reference_code} />
                </div>
            </>
        );
    }
}
