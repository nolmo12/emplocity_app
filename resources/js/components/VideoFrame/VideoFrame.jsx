import React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Comments from "../Comments/Comments";
import useFetchVideo from "../useFetchVideo";
import authUser from "../authUser";
import useUser from "../useUser";
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
    faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function VideoFrame({ mainRef, setFrameISLoaded }) {
    const [likesCount, setLikesCount] = useState(0);
    const [userName, setUserName] = useState();
    const [dislikesCount, setDislikesCount] = useState(0);
    const [renderKey, setRenderKey] = useState(0);
    const [thumbObj, setThumbObj] = useState({
        like: false,
        dislike: false,
        userInteraction: null,
        thumbStyle: null,
    });
    const timeUseFlag = useRef(false);
    const [showButtons, setShowButtons] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [adminFlag, setAdminFlag] = useState(false);
    const [watchTime, setWatchTime] = useState(0);
    const link = useRef();
    const user = useRef("");
    const playStartTime = useRef(0);
    const timeRef = useRef(0);
    const actualTime = useRef(0);
    const { isLogged, getUser } = authUser();
    const { isAdmin, removeVideo, removeUser } = useUser();
    const { sendToHistory } = useFetchVideosSearch();
    const { likeCountFunction } = useLikeCalculation();
    const { fetchLikes } = useLike();
    const { startTimer, pauseTimer, updateRemainingTime, timeRemaining } =
        useViews();
    const { reference_code, time } = useParams();
    const { videoObj, isLoading, getVideoLink, downloadVideo } = useFetchVideo({
        reference_code,
    });
    const MAX_DESCRIPTION_LENGTH = 50;

    const toggleButtons = () => {
        setShowButtons(!showButtons);
    };

    useEffect(() => {
        setUser();
        fetchLikeInfo();
    }, []);

    useEffect(() => {
        sendToHistory(reference_code);
        setThumbObj({
            like: false,
            dislike: false,
            userInteraction: null,
            thumbStyle: null,
        });
        // if (isLogged()) getUserName();

        setRenderKey((prev) => prev + 1);

        if (videoObj) {
            setLikesCount(videoObj.likesCount);
            setDislikesCount(videoObj.dislikesCount);
            setFrameISLoaded(true);
        }
        fetchLikeInfo();
    }, [reference_code, videoObj]);

    const calculateTime = (created, current) => {
        const minute = 60;
        const hour = minute * 60;
        const day = hour * 24;
        const month = day * 30;
        const year = day * 365;

        let result = Math.floor((current - new Date(created)) / 1000);
        if (result < minute) return `uploaded ${result} seconds ago`;
        if (result < hour)
            return `uploaded ${Math.floor(result / minute)} minutes ago`;
        if (result < day)
            return `uploaded ${Math.floor(result / hour)} hours ago`;
        if (result < month)
            return `uploaded ${Math.floor(result / day)} days ago`;
        if (result < year)
            return `uploaded ${Math.floor(result / month)} months ago`;

        return `uploaded ${Math.floor(result / year)} years ago`;
    };

    const setUser = async () => {
        user.current = await getUser();
        if (isLogged()) setUserName(user.current.name);

        setAdminFlag(await isAdmin());
    };

    const getLink = async (t) => {
        const tempLink = await getVideoLink(t);
        link.current = tempLink;
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const handlePlay = () => {
        const timeToSend = videoObj.video.duration * 0.3;
        playStartTime.current = Date.now();
        if (time && timeUseFlag.current === false) {
            console.log("Time is: ", time);
            const customTime = Number(time.slice(2));
            timeRef.current.currentTime = customTime;
            timeUseFlag.current = true;
            startTimer(timeToSend, customTime);
        } else {
            startTimer(timeToSend);
        }
    };

    const handlePause = () => {
        if (playStartTime.current) {
            const tempTime = Date.now() - playStartTime.current;
            setWatchTime((prev) => prev + tempTime);
            playStartTime.current = 0;
        }
        pauseTimer();
    };

    const handleTimeUpdate = (e) => {
        const currentTime = e.target.currentTime;
        const totalDuration = e.target.duration;
        updateRemainingTime(currentTime, totalDuration);
    };

    const handleClickDownload = async () => {
        console.log("Downloading video...");
        await downloadVideo();
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
        const videoOwnerUserName = videoObj.userName;
        const videoOwnerId = videoObj.userId;
        const videoType = videoObj.video.type;
        const uploadedTimeAgo = calculateTime(
            videoObj.video.created_at,
            new Date()
        );
        const tags = videoObj.tags;
        actualTime.current = videoDuration - timeRemaining.current;
        getLink(actualTime.current);
        return (
            <>
                <div
                    className={styles.videoFrameDiv}
                    data-testid="video-player"
                >
                    <video
                        ref={timeRef}
                        src={videoPath}
                        poster={videoThumbnail}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onTimeUpdate={(e) => handleTimeUpdate(e, videoDuration)}
                        controls
                        className={styles.videoScreen}
                    ></video>
                    <div className={styles.videoFrameInfo}>
                        <div className={styles.reportMenu}>
                            <FontAwesomeIcon
                                icon={faEllipsisV}
                                className={styles.videoFrameIcon}
                                onClick={toggleButtons}
                            />
                            <div
                                className={`${styles.buttonsContainer} ${
                                    showButtons ? styles.menuVisible : ""
                                }`}
                            >
                                {isLogged() && (
                                    <div>
                                        <Link
                                            to={`/report/video/${reference_code}`}
                                        >
                                            <button>Report video</button>
                                        </Link>
                                        <Link
                                            to={`/report/user/${videoOwnerId}`}
                                        >
                                            <button>Report user</button>
                                        </Link>
                                    </div>
                                )}
                                <button onClick={() => handleClickDownload()}>
                                    Download video
                                </button>
                                {adminFlag && (
                                    <button
                                        onClick={(e) =>
                                            removeVideo(reference_code)
                                        }
                                    >
                                        Remove Video
                                    </button>
                                )}
                                {adminFlag && (
                                    <button
                                        onClick={(e) =>
                                            removeUser(videoOwnerId)
                                        }
                                    >
                                        Remove User
                                    </button>
                                )}
                            </div>
                        </div>
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
                                className={`${styles.videoFrameIcon} ${
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

                        <p className={styles.videoFrameInfoTitle}>
                            <p data-testid="video-title">{videoTitle}</p>
                        </p>
                        <div className={styles.videoFrameInfoViews}>
                            <p>
                                {videoViews} {"views"}
                            </p>
                        </div>
                        {/*views views views views views views views */}
                        <p>{uploadedTimeAgo}</p>
                        <p className={styles.videoFrameOwner}>
                            <FontAwesomeIcon
                                icon={faUser}
                                className={styles.videoFrameOwnerAvatar}
                            />{" "}
                            {videoOwner ? (
                                <p data-testid="video-owner">
                                    <Link
                                        to={
                                            videoOwnerUserName === userName
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
                        </p>

                        <p className={styles.videoFrameInfoDesc}>
                            {videoDescription ? (
                                <>
                                    <p
                                        data-testid="video-description"
                                        className={
                                            !isDescriptionExpanded
                                                ? styles.collapsed
                                                : ""
                                        }
                                    >
                                        {isDescriptionExpanded
                                            ? videoDescription
                                            : videoDescription.length >
                                              MAX_DESCRIPTION_LENGTH
                                            ? `${videoDescription.slice(
                                                  0,
                                                  MAX_DESCRIPTION_LENGTH
                                              )}...`
                                            : videoDescription}
                                    </p>
                                    {videoDescription.length >
                                        MAX_DESCRIPTION_LENGTH &&
                                        (!isDescriptionExpanded ? (
                                            <button
                                                onClick={() =>
                                                    setIsDescriptionExpanded(
                                                        true
                                                    )
                                                }
                                            >
                                                Show more...
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    setIsDescriptionExpanded(
                                                        false
                                                    )
                                                }
                                            >
                                                Show less...
                                            </button>
                                        ))}
                                </>
                            ) : (
                                <p data-testid="video-description">
                                    No description
                                </p>
                            )}
                            <p>
                                {tags.map((tag, index) => {
                                    return (
                                        <Link
                                            to={`/tag/${tag.name}`}
                                            key={index}
                                        >
                                            <span
                                                key={index}
                                            >{` #${tag.name}`}</span>{" "}
                                        </Link>
                                    );
                                })}
                            </p>
                        </p>
                    </div>
                    <Comments
                        reference_code={reference_code}
                        mainRef={mainRef}
                        adminFlag={adminFlag}
                        renderKeyFromParent={renderKey}
                    />
                </div>
            </>
        );
    }
}
