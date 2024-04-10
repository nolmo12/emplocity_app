import React from "react";
import { useState } from "react";
import useSendLikeInfo from "./useSendLikeInfo";
export default function useLikeCalculation() {
    // po ponownym odpaleniu filmiku nie mam mozliwosci zmiany co dalem + jesli zostawilem na np 1 to dzialam z 1 do 2
    const [userThumb, setUserThumb] = useState("");
    const { sendLike } = useSendLikeInfo();
    const likeCountFunction = (
        likeType,
        likesCount,
        setLikesCount,
        dislikesCount,
        setDislikesCount,
        reference_code,
        videoObj
    ) => {
        console.log(videoObj);
        if (likeType === 1 && userThumb !== "like" && userThumb !== "dislike") {
            setLikesCount((prev) => prev + 1);
            setUserThumb("like");
            sendLike(reference_code, likeType);
        } else if (
            likeType === 0 &&
            userThumb !== "dislike" &&
            userThumb !== "like"
        ) {
            setDislikesCount((prev) => prev + 1);
            setUserThumb("dislike");
            sendLike(reference_code, likeType);
        } else if (likeType === 1 && userThumb === "like" && likesCount > 0) {
            setLikesCount((prev) => prev - 1);
            setUserThumb("");
            sendLike(reference_code, likeType);
        } else if (
            likeType === 0 &&
            userThumb === "dislike" &&
            dislikesCount > 0
        ) {
            setDislikesCount((prev) => prev - 1);
            setUserThumb("");
            sendLike(reference_code, likeType);
        } else if (likeType === 0 && userThumb === "like") {
            setLikesCount((prev) => prev - 1);
            setDislikesCount((prev) => prev + 1);
            setUserThumb("dislike");
            sendLike(reference_code, likeType);
        } else if (likeType === 1 && userThumb === "dislike") {
            setLikesCount((prev) => prev + 1);
            setDislikesCount((prev) => prev - 1);
            setUserThumb("like");
            sendLike(reference_code, likeType);
        }
        console.log(videoObj);
    };

    return {
        likeCountFunction,
    };
}
