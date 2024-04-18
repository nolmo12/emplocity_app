import React from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetchVideo from "../useFetchVideo";
import useLikeCalculation from "../useLikeCalculation";
import styles from "./video.module.css";
import { ClipLoader } from "react-spinners";

export default function Video({ videoObj }) {
    const [thumbnailIsLoaded, setThumbnailIsLoaded] = useState(false);
    const { calculateLikeRatio } = useLikeCalculation();
    if (videoObj) {
        const reference_code = videoObj.reference_code;
        const videoThumbnail = videoObj.thumbnail;
        const videoOwner = videoObj.userName;
        const videoDate = videoObj.created_at.substring(0, 10);
        const videoTitle = videoObj.languages[0].pivot.title;
        const likeRatio = calculateLikeRatio(
            videoObj.likesCount,
            videoObj.dislikesCount
        );
        const videoViews = videoObj.views;
        const path = `/video/${reference_code}`;
        return (
            <section className={styles.videoSection}>
                <Link to={path}>
                    <div id={styles.video}>
                        <div
                            style={{
                                backgroundColor: "#fff",
                                position: "relative",
                            }}
                        >
                            <img
                                src={videoThumbnail}
                                width={300}
                                onLoad={() => setThumbnailIsLoaded(true)}
                                alt="video thumbnail"
                                style={{
                                    opacity: thumbnailIsLoaded ? 1 : 0,
                                    position: "absolute",
                                }}
                            />
                            {!thumbnailIsLoaded && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                    }}
                                >
                                    <ClipLoader color="#000" />
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
                        <div id={styles.likes} className={styles.videoInfo}>
                            <p data-testid="video-like-ratio">{likeRatio}</p>
                        </div>
                    </div>
                </Link>
            </section>
        );
    }
}
