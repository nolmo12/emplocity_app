import React from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetchVideo from "../useFetchVideo";
import useLikeCalculation from "../useLikeCalculation";
import useFetchVideosHistory from "../useFetchVideosSearch";
import authUser from "../authUser";
import styles from "./video.module.css";
import { ClipLoader } from "react-spinners";

export default function Video({ videoObj }) {
    const [thumbnailIsLoaded, setThumbnailIsLoaded] = useState(false);
    const { calculateLikeRatio } = useLikeCalculation();
    const { sendToHistory } = useFetchVideosHistory();
    const { isLogged } = authUser();
    const getLikeRatioStyle = (likeRatio) => {
        const ratio = parseInt(likeRatio.replace("%", "").trim());

        if (isNaN(ratio)) {
            return {};
        }

        const green = [0, 255, 0];
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
        const videoViews = videoObj.views;
        const path = `/video/${reference_code}`;

        const sendVideoInfo = async (e) => {
            if (!isLogged) return;
            await sendToHistory(reference_code);
        };

        return (
            <section className={styles.videoSection}>
                <Link to={path} onClick={() => sendVideoInfo()}>
                    <div id={styles.video}>
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

                    <div className={styles.videoStat}>
                        <div id={styles.title} className={styles.videoInfo}>
                            <p data-testid="video-title">{videoTitle}</p>
                        </div>
                        <div className={styles.videoInfo}>
                            {videoOwner ? (
                                <p data-testid="video-owner">{videoOwner}</p>
                            ) : (
                                <p data-testid="video-owner">Guest</p>
                            )}
                        </div>
                        <div id={styles.views} className={styles.videoInfo}>
                            <p data-testid="video-views">{videoViews}</p>
                        </div>
                        <div className={styles.videoInfo}>
                            <p data-testid="video-date">{videoDate}</p>
                        </div>
                        <div
                            id={styles.likes}
                            className={styles.videoInfo}
                            style={getLikeRatioStyle(likeRatio)}
                        >
                            {likeRatio}
                        </div>
                    </div>
                </Link>
            </section>
        );
    }
}
