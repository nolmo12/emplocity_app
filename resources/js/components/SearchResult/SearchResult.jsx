import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useLikeCalculation from "../useLikeCalculation";
import useFetchVideosSearch from "../useFetchVideosSearch";
import authUser from "../authUser";
import styles from "./searchResult.module.css";
import { Link } from "react-router-dom";
// inaczej zwracane z likedVideos i videosHistory
function VideoThumbnail({ videoObj }) {
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
    const likeRatio = calculateLikeRatio(
        videoObj.likesCount,
        videoObj.dislikesCount
    );

    return (
        <div className={styles.videoInfo}>
            <p>{videoObj.title}</p>
            <p>{videoObj.userName}</p>
            <p>{videoObj.video.created_at.slice(0, 10)}</p>
            <p>{likeRatio}</p>
            <p>{videoObj.video.views}</p>
            <p>{videoObj.description}</p>
        </div>
    );
}

function UserInfo({ userObj }) {
    return (
        <div className={styles.userInfo}>
            <img src="fdf" alt="user avatar" />
            <p>{userObj.name}</p>
            <p>{userObj.email}</p>
        </div>
    );
}

export default function SearchResult({ searchType }) {
    const [videos, setVideos] = useState([]);
    const [searchedObj, setSearchedObj] = useState([]);
    const { query } = useParams();
    const { getUser } = authUser();
    const { videosHistory, likedVideos, fetchSearchedVideos, isLoading } =
        useFetchVideosSearch();
    const temp = async () => {
        const response = await fetchSearchedVideos(
            query,
            0,
            "upload_date_desc"
        );
        setSearchedObj(response);
    };

    useEffect(() => {
        temp();
        if (searchType === "userHistory") {
            setVideos(videosHistory);
        } else if (searchType === "userLikes") {
            setVideos(likedVideos);
        } else {
            temp();
        }
    }, [searchType, videosHistory, likedVideos, query]);

    if (isLoading) {
        return <h1>Loading...</h1>;
    }
    let view = undefined;
    if (searchType === "userSearch") {
        let matchedUser = [];
        let otherResults = [];

        // <Link to={``}>  - when user profile is ready
        Object.entries(searchedObj).forEach(([key, value]) => {
            if (key === "users") {
                value.forEach((user) => {
                    if (user.name === query) {
                        matchedUser.push(
                            <li key={user.id}>
                                <Link to={`/account/${user.id}`}>
                                    <UserInfo userObj={user} />
                                </Link>
                            </li>
                        );
                    } else {
                        otherResults.push(
                            <li key={user.id}>
                                <Link to={`/account/${user.id}`}>
                                    <UserInfo userObj={user} />
                                </Link>
                            </li>
                        );
                    }
                });
            } else if (key === "videos") {
                value.forEach((video) => {
                    otherResults.push(
                        <li key={video.id}>
                            <Link to={`/video/${video.video.reference_code}`}>
                                <VideoThumbnail videoObj={video} />
                            </Link>
                            <VideoInfo videoObj={video} />
                        </li>
                    );
                });
            }
        });

        view = (
            <ul>
                <h2>Search results</h2>
                {matchedUser}
                {otherResults}
            </ul>
        );
    } else if (searchType === "userHistory") {
        view = (
            <ul>
                <h2>History</h2>
                {videos.map((video) => (
                    <li key={video.id}>
                        <Link to={`/video/${video.video.reference_code}`}>
                            <VideoThumbnail videoObj={video} />
                        </Link>

                        <VideoInfo videoObj={video} />
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

                        <VideoInfo videoObj={video} />
                    </li>
                ))}
            </ul>
        );
    }

    return <div className={styles.searchResultsDiv}>{view}</div>;
}
