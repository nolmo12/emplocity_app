import React from "react";
import { useState } from "react";

export default function fetchImgFromStorage() {
    const [imageUrl, setImageUrl] = useState("");
    const fetchImage = async (img) => {
        try {
            const response = await fetch("/api/storage/find/image/" + img);
            setImageUrl(response);
        } catch (error) {
            console.log(error);
        }
    };
    return {
        fetchImage,
        imageUrl,
    };
}
