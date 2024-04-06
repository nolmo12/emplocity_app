import React from "react";

export default function VideoFrame() {
    return (
        <>
            <iframe
                src="https://www.youtube.com/embed/bWFiSfEyZV4?si=7IxFnJIEmlCFcRAy"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
            ></iframe>
            <h1>title</h1>
        </>
    );
}
