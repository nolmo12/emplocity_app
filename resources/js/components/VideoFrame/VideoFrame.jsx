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
import userEvent from "@testing-library/user-event";

export default function VideoFrame({ mainRef, setFrameISLoaded }) {
    const [likesCount, setLikesCount] = useState(0);
    const [userId, setUserId] = useState();
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
    const [isFollowed, setIsFollowed] = useState();
    const link = useRef();
    const user = useRef("");
    const playStartTime = useRef(0);
    const timeRef = useRef(0);
    const actualTime = useRef(0);
    const videoOwnerBorder = useRef("");
    const { isLogged, getUser } = authUser();
    const { isAdmin, removeVideo, removeUser, setError } = useUser();
    const { sendToHistory } = useFetchVideosSearch();
    const { likeCountFunction } = useLikeCalculation();
    const { fetchLikes } = useLike();
    const { startTimer, pauseTimer, updateRemainingTime, timeRemaining } =
        useViews();
    const { reference_code, time } = useParams();
    const {
        videoObj,
        isLoading,
        getVideoLink,
        downloadVideo,
        followUser,
        unfollowUser,
        checkFollow,
    } = useFetchVideo({
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
        checkIsFollowed();
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
        if (isLogged()) setUserId(user.current.id);

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
        await downloadVideo();
    };

    const handleClickFollowButton = async () => {
        if (isFollowed) {
            await unfollowUser(videoObj.userId);
            setIsFollowed(!isFollowed);
        } else {
            await followUser(videoObj.userId);
            setIsFollowed(!isFollowed);
        }
    };

    const checkIsFollowed = async () => {
        const response = await checkFollow(videoObj.userId);

        if (response && response.is_following === true) {
            setIsFollowed(true);
        } else {
            setIsFollowed(false);
        }
    };

    const fetchLikeInfo = async () => {
        if (!isLogged()) {
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
            setError(error);
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
        const videoOwnerId = videoObj.userId;
        const videoOwnerAvatar = videoObj.userAvatar;
        const videoOwnerFollowersCount = videoObj.followersCount;
        const videoVisibility = videoObj.video.visibility;
        const uploadedTimeAgo = calculateTime(
            videoObj.video.created_at,
            new Date()
        );
        const tags = videoObj.tags;
        actualTime.current = videoDuration - timeRemaining.current;
        if (videoObj.userBorder && videoObj.userBorder.type)
            videoOwnerBorder.current = videoObj.userBorder.type;
        getLink(videoDuration != actualTime.current ? actualTime.current : 0);
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
                        <div className={styles.videoFrameButtons}>
                            {videoOwnerId !== userId &&
                                userId &&
                                videoOwnerId && (
                                    <button
                                        onClick={handleClickFollowButton}
                                        className={styles.followButton}
                                    >
                                        {isFollowed ? "Unfollow" : "Follow"}
                                    </button>
                                )}
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
                                            {videoOwnerId && (
                                                <Link
                                                    to={`/report/user/${videoOwnerId}`}
                                                >
                                                    <button>Report user</button>
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                    {videoVisibility === "Public" && (
                                        <button
                                            onClick={() =>
                                                handleClickDownload()
                                            }
                                        >
                                            Download video
                                        </button>
                                    )}
                                    {adminFlag && (
                                        <button
                                            onClick={(e) =>
                                                removeVideo(reference_code)
                                            }
                                        >
                                            Remove Video
                                        </button>
                                    )}
                                    {adminFlag && videoOwnerId && (
                                        <button
                                            onClick={(e) =>
                                                removeUser(videoOwnerId, true)
                                            }
                                        >
                                            Remove User
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className={styles.videoFrameInfoTitle}>
                                <p data-testid="video-title">{videoTitle}</p>
                            </p>
                            <div className={styles.videoFrameInfoViews}>
                                <p>
                                    {videoViews} {"views"}
                                </p>
                            </div>
                            {videoOwnerFollowersCount !==
                                (undefined || null) && (
                                <p>Followers {videoOwnerFollowersCount}</p>
                            )}
                            <p>{uploadedTimeAgo}</p>
                            <div className={styles.avatarNicknameContainer}>
                                <div className={styles.avatarBorderContainer}>
                                    <img
                                        src={videoOwnerAvatar}
                                        alt="avatar"
                                        className={styles.avatar}
                                    />
                                    {videoOwnerBorder.current && (
                                        <img
                                            src={videoOwnerBorder.current}
                                            alt="border"
                                            className={styles.border}
                                        />
                                    )}
                                </div>
                                <p className={styles.videoFrameOwner}>
                                    {videoOwner ? (
                                        <p data-testid="video-owner">
                                            <Link
                                                to={
                                                    videoOwnerId === userId
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
                            </div>

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
