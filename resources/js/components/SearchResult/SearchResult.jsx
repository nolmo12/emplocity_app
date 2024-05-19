import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useLikeCalculation from "../useLikeCalculation";
import useFetchVideosSearch from "../useFetchVideosSearch";
import authUser from "../authUser";
import styles from "./searchResult.module.css";
import { Link } from "react-router-dom";
import { getLikeRatioStyle } from "../Video/Video";

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
    const truncatedDescription =
        videoObj.description && videoObj.description.length > 30
            ? videoObj.description.slice(0, 30) + "..."
            : videoObj.description;
    const { calculateLikeRatio } = useLikeCalculation();
    const likeRatio = calculateLikeRatio(
        videoObj.likesCount,
        videoObj.dislikesCount
    );
    const ratingStyle = getLikeRatioStyle(likeRatio);

    return (
        <div className={styles.videoInfo}>
            <p>{videoObj.title}</p>
            <p>{videoObj.userName}</p>
            <p>{videoObj.video.created_at.slice(0, 10)}</p>
            <p>
                Rating:{" "}
                <span style={{ color: ratingStyle.color }}>{likeRatio}</span>
            </p>
            <p>Views: {videoObj.video.views}</p>
            <p className={styles.videoDescription}>{truncatedDescription}</p>
        </div>
    );
}

function UserInfo({ userObj }) {
    return (
        <div className={styles.userInfo}>
            {console.log(userObj)}
            <img src={userObj.avatar} alt="user avatar" />
            <p>{userObj.name}</p>
            <p>{userObj.email}</p>
        </div>
    );
}

export default function SearchResult({ searchType }) {
    const [videos, setVideos] = useState([]);
    const [sortTypeValue, setSortTypeValue] = useState();
    const [searchedObj, setSearchedObj] = useState({});
    const { query, sortType } = useParams();
    const navigate = useNavigate();
    const {
        fetchVideosHistory,
        fetchLikedVideos,
        fetchSearchedVideos,
        isLoading,
    } = useFetchVideosSearch();

    const searchedVideos = async (sortType) => {
        const response = await fetchSearchedVideos(query, 0, sortType);
        setSearchedObj(response);
    };

    const likedVideos = async () => {
        const response = await fetchLikedVideos();
        setVideos(response);
    };

    const videosHistory = async () => {
        const response = await fetchVideosHistory();
        setVideos(response);
    };

    useEffect(() => {
        if (searchType === "userHistory") {
            videosHistory();
        } else if (searchType === "userLikes") {
            likedVideos();
        } else {
            if (!sortTypeValue) {
                searchedVideos(sortType);
            } else {
                searchedVideos(sortTypeValue);
            }
        }
    }, [searchType, query, sortTypeValue]);

    const handleChangeSort = (e) => {
        setSortTypeValue(e.target.value);
        navigate(`/search-result/${query}/${e.target.value}`);
    };

    const checkUrl = () => {
        if (sortType === "upload_date_desc") {
            return "upload_date_desc";
        } else if (sortType === "upload_date_asc") {
            return "upload_date_asc";
        } else if (sortType === "views") {
            return "views";
        } else if (sortType === "popularity") {
            return "popularity";
        }
    };

    if (isLoading) {
        return <h1>Loading...</h1>;
    }
    let view = undefined;
    if (searchType === "userSearch") {
        let matchedUser = [];
        let otherResults = [];
        Object.entries(searchedObj).forEach(([key, value]) => {
            if (key === "users") {
                value.forEach((user) => {
                    if (user.name === query) {
                        matchedUser.push(
                            <li key={`user-${user.id}`}>
                                <Link to={`/account/${user.id}`}>
                                    <UserInfo userObj={user} />
                                </Link>
                            </li>
                        );
                    } else {
                        otherResults.push(
                            <li key={`user-${user.id}`}>
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
                        <li key={`video-${video.video.id}`}>
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
                    <li key={video.video.id}>
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
                {videos.map((video) => (
                    <li key={video.video.id}>
                        <Link to={`/video/${video.video.reference_code}`}>
                            <VideoThumbnail videoObj={video} />
                        </Link>

                        <VideoInfo videoObj={video} />
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <div className={styles.searchResultsDiv}>
            {searchType === "userSearch" && (
                <select
                    onChange={(e) => handleChangeSort(e)}
                    value={checkUrl()}
                    className={styles.searchSort}
                >
                    <option value="upload_date_desc">desc</option>
                    <option value="upload_date_asc">asc</option>
                    <option value="views">views</option>
                    <option value="popularity">popularity</option>
                </select>
            )}
            {view}
        </div>
    );
}
