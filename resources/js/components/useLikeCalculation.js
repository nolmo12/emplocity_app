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
        setUserInteraction,
        setThumbStyle
    ) => {
        if (isLogged && !isProcessing) {
            setIsProcessing(true);
            if (userInteraction !== 1 && userInteraction !== 0) {
                if (
                    likeType === 1 &&
                    userThumb !== "like" &&
                    userThumb !== "dislike"
                ) {
                    console.log(1);
                    setLikesCount((prev) => prev + 1);
                    setUserThumb("like");
                    setThumbStyle("like");
                    sendLikes(reference_code, likeType);
                } else if (
                    likeType === 0 &&
                    userThumb !== "dislike" &&
                    userThumb !== "like"
                ) {
                    console.log(2);
                    setDislikesCount((prev) => prev + 1);
                    setUserThumb("dislike");
                    setThumbStyle("dislike");
                    sendLikes(reference_code, likeType);
                } else if (
                    likeType === 1 &&
                    userThumb === "like" &&
                    likesCount > 0
                ) {
                    console.log(3);
                    setLikesCount((prev) => prev - 1);
                    setUserThumb("");
                    setThumbStyle("");
                    sendLikes(reference_code, likeType);
                } else if (
                    likeType === 0 &&
                    userThumb === "dislike" &&
                    dislikesCount > 0
                ) {
                    console.log(4);
                    setDislikesCount((prev) => prev - 1);
                    setUserThumb("");
                    setThumbStyle("");
                    sendLikes(reference_code, likeType);
                } else if (likeType === 0 && userThumb === "like") {
                    console.log(5);
                    setLikesCount((prev) => prev - 1);
                    setDislikesCount((prev) => prev + 1);
                    setUserThumb("dislike");
                    setThumbStyle("dislike");
                    sendLikes(reference_code, likeType);
                } else if (likeType === 1 && userThumb === "dislike") {
                    console.log(6);
                    setDislikesCount((prev) => prev - 1);
                    setLikesCount((prev) => prev + 1);
                    setUserThumb("like");
                    setThumbStyle("like");
                    sendLikes(reference_code, likeType);
                }
            } else {
                if (likeType === 1 && userInteraction === 1) {
                    console.log(7);
                    setLikesCount((prev) => prev - 1);
                    setUserInteraction(null);
                    setThumbStyle("");
                    sendLikes(reference_code, likeType);
                } else if (likeType === 0 && userInteraction === 0) {
                    console.log(8);
                    setDislikesCount((prev) => prev - 1);
                    setUserInteraction(null);
                    setThumbStyle("");
                    sendLikes(reference_code, likeType);
                } else if (likeType === 1 && userInteraction === 0) {
                    console.log(9);
                    setLikesCount((prev) => prev + 1);
                    setDislikesCount((prev) => prev - 1);
                    setUserInteraction(1);
                    setThumbStyle("like");
                    sendLikes(reference_code, likeType);
                } else if (likeType === 0 && userInteraction === 1) {
                    console.log(10);
                    setDislikesCount((prev) => prev + 1);
                    setLikesCount((prev) => prev - 1);
                    setThumbStyle("dislike");
                    setUserInteraction(0);
                    sendLikes(reference_code, likeType);
                }
            }
            setIsProcessing(false);
        }
    };

    const calculateLikeRatio = (likesCount, dislikesCount) => {
        if (likesCount >= dislikesCount) {
            const result = (likesCount / (likesCount + dislikesCount)) * 100;
            if (result) return result + "%";
            return "no ratings";
        } else {
            const result = (dislikesCount / (likesCount + dislikesCount)) * 100;
            if (result) return "-" + result + "%";
            return "no ratings";
        }
    };

    return {
        likeCountFunction,
        calculateLikeRatio,
    };
}
