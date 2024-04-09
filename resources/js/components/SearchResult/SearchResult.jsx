import React from "react";
import Video from "../Video/Video";
import useFetchAllVideos from "../useFetchAllVideos";

export default function SearchResult() {
    const { videos, isLoading } = useFetchAllVideos();
    console.log(videos);
    if (isLoading) {
        return <h1>Loading...</h1>;
    }
    return (
        <ul>
            <li>
                {videos.map((video) => {
                    return <Video key={video.id} videoObj={video} />;
                })}
            </li>
        </ul>
    );
}
