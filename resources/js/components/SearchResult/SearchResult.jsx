import React from "react";
import Video from "../Video/Video";
import useFetchAllVideos from "../useFetchAllVideos";
import styles from "./searchResult.module.css";

export default function SearchResult() {
    const { videos, isLoading } = useFetchAllVideos();
    console.log(videos);
    if (isLoading) {
        return <h1>Loading...</h1>;
    }
    return (
        <div className={styles.searchResultsDiv}>
            <ul>
                <h2>Search results</h2>
                <li>
                    {videos.map((video) => {
                        return <Video key={video.id} videoObj={video}/>;
                    })}
                </li>
            </ul>
        </div>
    );
}
