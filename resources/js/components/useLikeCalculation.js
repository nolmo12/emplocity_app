import React from "react";
import { useState } from "react";
import authUser from "./authUser";
import useLike from "./useLike";

export default function useLikeCalculation() {
    const [userThumb, setUserThumb] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const { fetchLikes, sendLikes } = useLike();
    const { isLogged } = authUser();

    const likeCountFunction = async (
        likeType,
        likesCount,
        setLikesCount,
        dislikesCount,
        setDislikesCount,
        reference_code,
        userInteraction,
        setUserInteraction
    ) => {
        if (isLogged && !isProcessing) {
            setIsProcessing(true);

            if (
                likeType === 1 &&
                userThumb !== "like" &&
                userThumb !== "dislike"
            ) {
                setLikesCount((prev) => prev + 1);
                setUserThumb("like");
                sendLikes(reference_code, likeType);
            } else if (
                likeType === 0 &&
                userThumb !== "dislike" &&
                userThumb !== "like"
            ) {
                setDislikesCount((prev) => prev + 1);
                setUserThumb("dislike");
                sendLikes(reference_code, likeType);
            } else if (
                likeType === 1 &&
                userThumb === "like" &&
                likesCount > 0
            ) {
                setLikesCount((prev) => prev - 1);
                setUserThumb("");
                sendLikes(reference_code, likeType);
            } else if (
                likeType === 0 &&
                userThumb === "dislike" &&
                dislikesCount > 0
            ) {
                setDislikesCount((prev) => prev - 1);
                setUserThumb("");
                sendLikes(reference_code, likeType);
            } else if (likeType === 0 && userThumb === "like") {
                setLikesCount((prev) => prev - 1);
                setDislikesCount((prev) => prev + 1);
                setUserThumb("dislike");
                sendLikes(reference_code, likeType);
            } else if (likeType === 1 && userThumb === "dislike") {
                setDislikesCount((prev) => prev - 1);
                setLikesCount((prev) => prev + 1);
                setUserThumb("like");
                sendLikes(reference_code, likeType);
            } else {
                console.log("unexpected error");
            }
            console.log(userInteraction);
            setIsProcessing(false);
        }
    };

    return {
        likeCountFunction,
    };
}
