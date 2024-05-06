import React from "react";
import { useState } from "react";
import authUser from "./authUser";
import useLike from "./useLike";

export default function useLikeCalculation() {
    const [isProcessing, setIsProcessing] = useState(false);
    const { fetchLikes, sendLikes } = useLike();
    const { isLogged } = authUser();

    const likeCountFunction = async (
        thumbType,
        thumbObj,
        setThumbObj,
        reference_code,
        likesCount,
        dislikesCount,
        setLikesCount,
        setDislikesCount
    ) => {
        if (isLogged && !isProcessing) {
            setIsProcessing(true);
            if (
                !thumbObj.like &&
                !thumbObj.dislike &&
                thumbObj.userInteraction === null
            ) {
                if (thumbType === 1) {
                    setThumbObj({
                        like: true,
                        dislike: false,
                        userInteraction: "like",
                        thumbStyle: "like",
                    });
                    sendLikes(reference_code, thumbType);
                    setLikesCount((prev) => prev + 1);
                } else {
                    console.log("dislike");
                    setThumbObj({
                        like: false,
                        dislike: true,
                        userInteraction: "dislike",
                        thumbStyle: "dislike",
                    });
                    sendLikes(reference_code, thumbType);
                    setDislikesCount((prev) => prev + 1);
                }
            }
            if (thumbObj.like && thumbType === 1 && likesCount > 0) {
                setThumbObj({
                    like: false,
                    dislike: false,
                    userInteraction: null,
                    thumbStyle: null,
                });
                sendLikes(reference_code, 1);
                setLikesCount((prev) => prev - 1);
            }
            if (thumbObj.dislike && thumbType === 0 && dislikesCount > 0) {
                setThumbObj({
                    like: false,
                    dislike: false,
                    userInteraction: null,
                    thumbStyle: null,
                });
                sendLikes(reference_code, 0);
                setDislikesCount((prev) => prev - 1);
            }
            // potential bug here
            if (thumbObj.like && thumbType === 0 && likesCount > 0) {
                setThumbObj({
                    like: false,
                    dislike: true,
                    userInteraction: "dislike",
                    thumbStyle: "dislike",
                });
                sendLikes(reference_code, 0);
                setLikesCount((prev) => prev - 1);
                setDislikesCount((prev) => prev + 1);
            }
            if (thumbObj.dislike && thumbType === 1 && dislikesCount > 0) {
                setThumbObj({
                    like: true,
                    dislike: false,
                    userInteraction: "like",
                    thumbStyle: "like",
                });
                sendLikes(reference_code, 1);
                setLikesCount((prev) => prev + 1);
                setDislikesCount((prev) => prev - 1);
            }

            setIsProcessing(false);
        }
    };

    const calculateLikeRatio = (likesCount, dislikesCount) => {
            const result = Math.round((likesCount / (likesCount + dislikesCount)) * 100);
            if (result || likesCount + dislikesCount != 0) return result + "%";
            return "no ratings";
    };

    return {
        likeCountFunction,
        calculateLikeRatio,
    };
}
