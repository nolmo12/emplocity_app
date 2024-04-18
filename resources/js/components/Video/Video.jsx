import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useFetchVideo from "../useFetchVideo";
import useLikeCalculation from "../useLikeCalculation";
import styles from "./video.module.css";
import { ClipLoader } from "react-spinners";

export default function Video({ videoObj }) {
    const [thumbnailIsLoaded, setThumbnailIsLoaded] = useState(false);
    const { calculateLikeRatio } = useLikeCalculation();
    const getLikeRatioStyle = (likeRatio) => {
        console.log(likeRatio);
        const ratio = parseInt(likeRatio.replace("%", "").trim());
    
        if (isNaN(ratio)) {
            return {}; 
        }
    
        const green = [0, 255, 0]; 
        const red = [255, 0, 0]; 
    
        const interpolateColor = (color1, color2, factor) => {
            const result = color1.slice();
            for (let i = 0; i < 3; i++) {
                result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
            }
            return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
        };
    
        const textColor = interpolateColor(red, green, ratio / 100);
    
        return { color: textColor };
    };
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
        console.log(videoObj);
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
                            {videoTitle}
                        </div>
                        <div className={styles.videoInfo}>
                            {videoOwner ? videoOwner : "Guest"}
                        </div>
                        <div id={styles.views} className={styles.videoInfo}>
                            {videoViews}
                        </div>
                        <div className={styles.videoInfo}>{videoDate}</div>
                        <div id={styles.likes} className={styles.videoInfo} style={getLikeRatioStyle(likeRatio)}>
    {likeRatio}
</div>
                    </div>
                </Link>
            </section>
        );
    }
}
