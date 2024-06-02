import React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useLikeCalculation from "../useLikeCalculation";
import useFetchVideosSearch from "../useFetchVideosSearch";
import authUser from "../authUser";
import _ from "lodash";
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
            <p className={styles.videoTitle}>{videoObj.title}</p>
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
            <img src={userObj.avatar} alt="user avatar" />
            {userObj.current_border && (
                <img src={userObj.current_border.type} />
            )}
            <div className={styles.userInfoText}>
                <p>{userObj.name}</p>
            </div>
        </div>
    );
}

export default function SearchResult({ searchType }) {
    const [videos, setVideos] = useState([]);
    const [sortTypeValue, setSortTypeValue] = useState();
    const [searchedObj, setSearchedObj] = useState({});
    const offset = useRef(1);
    const [hasScrolledPast85, setHasScrolledPast85] = useState(false);
    const previousScroll = useRef(0);
    const { query, sortType } = useParams();

    const navigate = useNavigate();
    const {
        fetchVideosHistory,
        fetchLikedVideos,
        fetchSearchedVideos,
        isLoading,
        setIsLoading,
    } = useFetchVideosSearch();
    const { http } = authUser();

    const searchedVideos = async (sortType) => {
        const response = await fetchSearchedVideos(
            query,
            offset.current,
            sortType
        );
        if (offset.current < 2) {
            setSearchedObj(response);
        } else {
            // page is always 1
            if (response.videos.length === 0) return;
            setSearchedObj((prev) => {
                return {
                    ...prev,
                    videos: [...prev.videos, ...response.videos],
                };
            });
        }
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
        offset.current = 1;
        if (searchType === "userHistory") {
            videosHistory();
        } else if (searchType === "userLikes") {
            likedVideos();
        } else {
            if (!sortTypeValue && searchType !== "userFollows") {
                searchedVideos(sortType);
            } else if (searchType !== "userFollows") {
                searchedVideos(sortType);
            } else {
                getUserFollows();
                setIsLoading(false);
            }
        }
    }, [searchType, query, sortTypeValue]);

    const handleChangeSort = (e) => {
        setSortTypeValue(e.target.value);
        navigate(`/search-result/${query}/${e.target.value}`);
        sortVideos(e.target.value);
    };

    const sortVideos = async (sortType) => {
        for (let i = 1; i < videos.length; i++) {
            setSearchedObj({});
            const response = await fetchSearchedVideos(query, i, sortType);
            setSearchedObj((prev) => {
                return {
                    ...prev,
                    videos: [...prev.videos, ...response.videos],
                };
            });
        }
    };

    const getUserFollows = async () => {
        try {
            const response = await http.get(`/api/auth/followed`);
            setVideos(response.data);
        } catch (error) {
            console.log(error);
        }
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

    const handleScroll = _.throttle((event) => {
        if (searchType === "userSearch") {
            const target = event.target;
            const currentScroll = target.scrollTop;
            const scrollPercentage =
                (target.scrollTop /
                    (target.scrollHeight - target.clientHeight)) *
                100;
            if (previousScroll.current < currentScroll) {
                if (scrollPercentage > 85 && !hasScrolledPast85) {
                    offset.current += 1;
                    searchedVideos(sortType);
                    setHasScrolledPast85(true);
                } else if (scrollPercentage < 85) {
                    setHasScrolledPast85(false);
                }
            }
            previousScroll.current = currentScroll;
        }
    }, 1500);

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
                        <li
                            key={`video-${video.video.id}-${
                                sortTypeValue + video.video.title || "default"
                            }`}
                        >
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
                        <Link
                            to={`/video/${video.video.reference_code}/time=0`}
                        >
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
    } else if (searchType === "userFollows") {
        // videos is followed users
        view = (
            <ul>
                <h2></h2>
                {videos.length === 0 ? (
                    <h2>No followed users</h2>
                ) : (
                    videos.map((user) => {
                        return (
                            <li key={user.id}>
                                <Link to={`/user/${user.id}`}>
                                    <UserInfo userObj={user} />
                                </Link>
                            </li>
                        );
                    })
                )}
            </ul>
        );
    }

    return (
        <div
            className={styles.searchResultsDiv}
            onScroll={(e) => handleScroll(e)}
        >
            {searchType === "userSearch" && (
                <select
                    onChange={(e) => handleChangeSort(e)}
                    value={checkUrl()}
                    className={styles.searchSort}
                >
                    <option value="upload_date_desc">From newest</option>
                    <option value="upload_date_asc">From oldest</option>
                    <option value="views">By most viewed</option>
                    <option value="popularity">By popularity</option>
                </select>
            )}
            {view}
        </div>
    );
}
