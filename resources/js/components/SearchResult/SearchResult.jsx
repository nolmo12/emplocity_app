import React from "react";
import Video from "../Video/Video";
import useFetchAllVideos from "../useFetchAllVideos";
import useLikeCalculation from "../useLikeCalculation";
import useFetchVideosHistory from "../useFetchVideosHistory";
import authUser from "../authUser";
import styles from "./searchResult.module.css";
import { Link } from "react-router-dom";
import useFetchVideo from "../useFetchVideo";

function VideoThumbnail({ videoObj }) {
    return (
        <div className={styles.thumbnailContainer}>
            <img
                src={videoObj.thumbnail}
                alt="video thumbnail"
                className={styles.thumbnail}
            />
        </div>
    );
}

function VideoInfo({ videoObj }) {
    const { calculateLikeRatio } = useLikeCalculation();
    const likeRatio = calculateLikeRatio(
        videoObj.likesCount,
        videoObj.dislikesCount
    );

    return (
        <div className={styles.videoInfo}>
            <p>{videoObj.languages[0].pivot.title}</p>
            <p>{videoObj.userName || "Guest"}</p>
            <p>{videoObj.created_at.substring(0, 10)}</p>
            <p>{likeRatio}</p>
            <p>{videoObj.views}</p>
            <p>{videoObj.description || "No description"}</p>
        </div>
    );
}

export default function SearchResult({ searchType }) {
    const { getUser } = authUser();
    const { videos, isLoading } = useFetchVideosHistory();
    if (getUser()) {
        const { videos } = useFetchVideosHistory();
    }

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    let view = undefined;
    if (searchType === "userSearch") {
        view = (
            <ul>
                <h2>Search results</h2>
                {videos.map((video) => (
                    <li key={video.id}>
                        <Link to={`/video/${video.reference_code}`}>
                            <VideoThumbnail videoObj={video} />
                        </Link>
                        <Link to={`/video/${video.reference_code}`}>
                            <VideoInfo videoObj={video} />
                        </Link>
                    </li>
                ))}
            </ul>
        );
    } else if (searchType === "userHistory") {
        view = (
            <ul>
                <h2>History</h2>
                {videos.map((video) => (
                    <li key={video.id}>
                        <Link to={`/video/${video.reference_code}`}>
                            <VideoThumbnail videoObj={video} />
                        </Link>
                        <Link to={`/video/${video.reference_code}`}>
                            <VideoInfo videoObj={video} />
                        </Link>
                    </li>
                ))}
            </ul>
        );
    } else if (searchType === "userLikes") {
        view = (
            <ul>
                <h2>User likes</h2>
                {console.log(videos)}
                {videos.map((video) => (
                    <li key={video.id}>
                        <Link to={`/video/${video.reference_code}`}>
                            <VideoThumbnail videoObj={video} />
                        </Link>
                        <Link to={`/video/${video.reference_code}`}>
                            <VideoInfo videoObj={video} />
                        </Link>
                    </li>
                ))}
            </ul>
        );
    }

    return <div className={styles.searchResultsDiv}>{view}</div>;
}
