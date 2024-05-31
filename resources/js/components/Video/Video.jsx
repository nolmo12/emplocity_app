import React from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetchVideo from "../useFetchVideo";
import useLikeCalculation from "../useLikeCalculation";
import useFetchVideosHistory from "../useFetchVideosSearch";
import authUser from "../authUser";
import styles from "./video.module.css";
import { ClipLoader } from "react-spinners";

export const getLikeRatioStyle = (likeRatio) => {
    const ratio = parseInt(likeRatio.replace("%", "").trim());

    if (isNaN(ratio)) {
        return {};
    }

    const green = [0, 200, 0];
    const red = [255, 0, 0];

    const interpolateColor = (color1, color2, factor) => {
        const result = color1.slice();
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(
                result[i] + factor * (color2[i] - color1[i])
            );
        }
        return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
    };

    const textColor = interpolateColor(red, green, ratio / 100);

    return { color: textColor };
};

export default function Video({ videoObj }) {
    const [thumbnailIsLoaded, setThumbnailIsLoaded] = useState(false);
    const { calculateLikeRatio } = useLikeCalculation();
    const { sendToHistory } = useFetchVideosHistory();
    const { isLogged } = authUser();

    if (videoObj) {
        const reference_code = videoObj.video.reference_code;
        const videoThumbnail = videoObj.video.thumbnail;
        const videoOwner = videoObj.userName;
        const videoDate = videoObj.video.created_at.substring(0, 10);
        const videoTitle = videoObj.title;
        const likeRatio = calculateLikeRatio(
            videoObj.likesCount,
            videoObj.dislikesCount
        );
        const videoAvatar = videoObj.userAvatar;
        const videoBorder = videoObj.userBorder;
        const videoViews = videoObj.views;
        const path = `/video/${reference_code}`;

        const sendVideoInfo = async (e) => {
            if (!isLogged()) return;
            await sendToHistory(reference_code);
        };

        return (
            <section className={styles.videoSection}>
                <Link to={path} onClick={() => sendVideoInfo()}>
                    <div className={styles.video}>
                        <div className={styles.thumbnailContainer}>
                            <img
                                src={videoThumbnail}
                                onLoad={() => setThumbnailIsLoaded(true)}
                                alt="video thumbnail"
                                className={`${styles.thumbnail} ${
                                    thumbnailIsLoaded ? styles.loaded : ""
                                }`}
                            />
                            {!thumbnailIsLoaded && (
                                <div className={styles.loader}>
                                    <ClipLoader className={styles.clipLoader} />
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
                <div className={styles.videoStat}>
                    <div className={styles.videoInfo}>
                        <p className={styles.videoTitle}>{videoTitle}</p>
                    </div>
                    <div className={styles.videoInfo}>
                        <div className={styles.videoAvatarContainer}>
                            <img
                                src={videoAvatar}
                                className={styles.userAvatar}
                            ></img>
                            {videoBorder && (
                                <img
                                    src={videoBorder.type}
                                    className={styles.border}
                                />
                            )}
                        </div>
                        <div>
                            {videoOwner ? (
                                <p data-testid="video-owner">{videoOwner}</p>
                            ) : (
                                <p data-testid="video-owner">Guest</p>
                            )}
                        </div>
                    </div>
                    <div className={styles.videoInfo}>
                        <p data-testid="video-views">{videoViews}</p>
                    </div>
                    <div className={styles.videoInfo}>
                        <p data-testid="video-date">{videoDate}</p>
                    </div>
                    <div
                        className={styles.videoInfo}
                        style={getLikeRatioStyle(likeRatio)}
                    >
                        {likeRatio}
                    </div>
                </div>
            </section>
        );
    }
}
