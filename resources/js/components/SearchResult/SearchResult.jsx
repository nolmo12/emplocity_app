import React from "react";
import { useState, useEffect } from "react";
import useLikeCalculation from "../useLikeCalculation";
import useFetchVideosHistory from "../useFetchVideosHistory";
import authUser from "../authUser";
import styles from "./searchResult.module.css";
import { Link } from "react-router-dom";
// inaczej zwracane z likedVideos i videosHistory
function VideoThumbnail({ videoObj }) {
    console.log(videoObj);
    return (
        <div className={styles.thumbnailContainer}>
            <img
                src={videoObj.video.thumbnail}
                alt="video thumbnail"
                className={styles.thumbnail}
            />
        </div>
    );
}

function VideoInfo({ videoObj }) {
    const { calculateLikeRatio } = useLikeCalculation();
    // const likeRatio = calculateLikeRatio(
    //     videoObj.likesCount,
    //     videoObj.dislikesCount
    // );
    console.log(videoObj);
    return (
        <div className={styles.videoInfo}>
            <p>title</p>
            <p>Username</p>
            <p>creted</p>
            <p>ratio</p>
            <p>views</p>
            <p>description</p>
        </div>
    );
}

export default function SearchResult({ searchType }) {
    const [videos, setVideos] = useState([]);
    const { getUser } = authUser();
    const { videosHistory, likedVideos, isLoading, sendToHistory } =
        useFetchVideosHistory();

    useEffect(() => {
        if (searchType === "userHistory") {
            setVideos(videosHistory);
        } else {
            setVideos(likedVideos);
        }
    }, [searchType, videosHistory, likedVideos]);

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
                        <Link to={`/video/${video.video.reference_code}`}>
                            <VideoThumbnail videoObj={video} />
                        </Link>
                        <Link to={`/video/${video.video.reference_code}`}>
                            <VideoInfo videoObj={video} />
                        </Link>
                    </li>
                ))}
            </ul>
        );
    } else if (searchType === "userHistory") {
        console.log(videos);
        view = (
            <ul>
                <h2>History</h2>
                {videos.map((video) => (
                    <li key={video.id}>
                        <Link to={`/video/${video.video.reference_code}`}>
                            <VideoThumbnail videoObj={video} />
                        </Link>
                        <Link to={`/video/${video.video.reference_code}`}>
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
                        <Link to={`/video/${video.video.reference_code}`}>
                            <VideoThumbnail videoObj={video} />
                        </Link>
                        <Link to={`/video/${video.video.reference_code}`}>
                            <VideoInfo videoObj={video} />
                        </Link>
                    </li>
                ))}
            </ul>
        );
    }

    return <div className={styles.searchResultsDiv}>{view}</div>;
}
