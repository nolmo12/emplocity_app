import React from "react";
import Video from "../Video/Video";
import useFetchAllVideos from "../useFetchAllVideos";
import styles from "./searchResult.module.css";

export default function SearchResult({ searchType }) {
    const { videos, isLoading } = useFetchAllVideos();
    console.log(videos);
    if (isLoading) {
        return <h1>Loading...</h1>;
    }
    let view = undefined;
    if (searchType === "userSearch") {
        view = (
            <ul>
                <h2>Search results</h2>
                <li>
                    {videos.map((video) => {
                        return <Video key={video.id} videoObj={video} />;
                    })}
                </li>
            </ul>
        );
    } else if (searchType === "userHistory") {
        view = (
            <ul>
                <h2>Histroy</h2>
                <li>
                    {videos.map((video) => {
                        return <Video key={video.id} videoObj={video} />;
                    })}
                </li>
            </ul>
        );
    } else if (searchType === "userLikes") {
        view = (
            <ul>
                <h2>User likes</h2>
                <li>
                    {videos.map((video) => {
                        return <Video key={video.id} videoObj={video} />;
                    })}
                </li>
            </ul>
        );
    }
    return <div className={styles.searchResultsDiv}>{view}</div>;
}
