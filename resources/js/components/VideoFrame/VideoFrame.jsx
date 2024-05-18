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

export default function VideoFrame({ mainRef }) {
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
    const [showButtons, setShowButtons] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [adminFlag, setAdminFlag] = useState(false);
    const link = useRef();
    const user = useRef("");
    const { isLogged } = authUser();
    const { getUser, isAdmin, removeVideo, removeUser, removeComment } =
        useUser();
    const { sendToHistory } = useFetchVideosSearch();
    const { likeCountFunction } = useLikeCalculation();
    const { fetchLikes } = useLike();
    const { startTimer, pauseTimer, timeRemaining } = useViews();
    const { reference_code, time } = useParams();
    const { videoObj, isLoading, getVideoLink } = useFetchVideo({
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
        if (isLogged()) getUserFirstNameAndId();
        setRenderKey((prev) => prev + 1);

        if (videoObj) {
            getLink();
            setLikesCount(videoObj.likesCount);
            setDislikesCount(videoObj.dislikesCount);
        }
        // fetchLikeInfo();
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

    const getUserFirstNameAndId = () => {
        setUserFirstName(user.first_name);
    };

    const setUser = async () => {
        user.current = await getUser();
        setAdminFlag(await isAdmin());
    };

    const getLink = async () => {
        const tempLink = await getVideoLink();
        link.current = tempLink.url;
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const handleTimeUpdate = (e, duration) => {
        const currentTime = e.target.currentTime;
        duration += currentTime;
    };

    const handleClickDownload = async () => {
        // api call to download video
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
        const uploadedTimeAgo = calculateTime(
            videoObj.video.created_at,
            new Date()
        );
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
                                reference_code,
                                (timeRemaining.current.currentTime = time
                                    ? time.split("=")[1]
                                    : 0)
                            )
                        }
                        onPause={() => pauseTimer()}
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
                        <p className={styles.videoFrameOwner}>
                            <FontAwesomeIcon
                                icon={faUser}
                                className={styles.videoFrameOwnerAvatar}
                            />{" "}
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
                        <p>{uploadedTimeAgo}</p>
                        <button onClick={() => handleClickDownload()}>
                            Download video
                        </button>
                        {adminFlag && (
                            <button
                                onClick={(e) => removeVideo(reference_code)}
                            >
                                Remove Video
                            </button>
                        )}
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
