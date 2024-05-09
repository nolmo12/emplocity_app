import React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Comments from "../Comments/Comments";
import useFetchVideo from "../useFetchVideo";
import authUser from "../authUser";
import useViews from "../useViews";
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
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function VideoFrame() {
    const link = useRef();
    const { isLogged, getUser } = authUser();
    const { sendToHistory } = useFetchVideosSearch();
    const { likeCountFunction } = useLikeCalculation();
    const { fetchLikes } = useLike();
    const { startTimer, pauseTimer, timeRemaining } = useViews();
    const { reference_code } = useParams();
    const { videoObj, isLoading, getVideoLink } = useFetchVideo({
        reference_code,
    });
    const [likesCount, setLikesCount] = useState(0);
    const [userFirstName, setUserFirstName] = useState();
    const [dislikesCount, setDislikesCount] = useState(0);
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
        getUserFirstNameAndId();
        setRenderKey((prev) => prev + 1);

        if (videoObj) {
            getLink();
            setLikesCount(videoObj.likesCount);
            setDislikesCount(videoObj.dislikesCount);
        }
        fetchLikeInfo();
    }, [reference_code, videoObj]);

    const getUserFirstNameAndId = async () => {
        const user = await getUser();
        setUserFirstName(user.first_name);
    };

    const getLink = async () => {
        const tempLink = await getVideoLink();
        link.current = tempLink.url;
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const fetchLikeInfo = async () => {
        if (!isLogged()) {
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

    if (!isLoading) {
        const videoTitle = videoObj.title;
        const videoPath = videoObj.video.video;
        const videoDescription = videoObj.description;
        const videoThumbnail = videoObj.video.thumbnail;
        const videoOwner = videoObj.userName;
        const videoViews = videoObj.video.views;
        const videoDuration = videoObj.video.duration;
        const videoOwnerFirstName = videoObj.userFirstName;
        const videoOwnerId = videoObj.userId;
        const tags = videoObj.tags;
        return (
            <>
                <div
                    className={styles.videoFrameDiv}
                    data-testid="video-player"
                >
                    <video
                        ref={timeRemaining}
                        width={320}
                        src={videoPath}
                        poster={videoThumbnail}
                        onPlay={() =>
                            startTimer(
                                Number(videoDuration * 0.3),
                                reference_code
                            )
                        }
                        onPause={() => pauseTimer()}
                        controls
                        className={styles.videoScreen}
                    ></video>
                    <div className={styles.videoFrameInfo}>
                        <Popup
                            trigger={
                                <FontAwesomeIcon
                                    icon={faShare}
                                    className={styles.videoFrameIcon}
                                />
                            }
                            position="center"
                            modal
                            className={styles.customPopup}
                        >
                            {(close) => (
                                <div className={styles.sharePopup}>
                                    <p>{link.current}</p>
                                    <button
                                        onClick={() => {
                                            copyToClipboard(link.current);
                                        }}
                                    >
                                        Copy
                                    </button>
                                    <button
                                        onClick={() => {
                                            close();
                                        }}
                                    >
                                        Ok
                                    </button>
                                </div>
                            )}
                        </Popup>
                        <div className={styles.videoFrameInfoViews}>
                            <p>
                                <FontAwesomeIcon icon={faUser} /> {videoViews}
                            </p>
                        </div>
                        {/*views views views views views views views */}
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
                                <p data-testid="video-owner">
                                    <Link
                                        to={
                                            videoOwnerFirstName ===
                                            userFirstName
                                                ? `/account`
                                                : `/user/${videoOwnerId}`
                                        } // need endpoint video -> ownerId
                                    >
                                        {videoOwner}
                                    </Link>
                                </p>
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
                            <p>
                                {tags.map((tag, index) => {
                                    return (
                                        <Link to={`/${tag.name}`} key={index}>
                                            <span
                                                key={index}
                                            >{` #${tag.name}`}</span>{" "}
                                        </Link>
                                    );
                                })}
                            </p>
                        </h1>
                    </div>
                    <Comments reference_code={reference_code} />
                </div>
            </>
        );
    }
}
