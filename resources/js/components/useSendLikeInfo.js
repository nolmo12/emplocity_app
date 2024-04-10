import axios from "axios";
import { useState, useEffect } from "react";
import authUser from "./authUser";
export default function useSendLikeInfo() {
    const { http } = authUser();
    const sendLike = async (reference_code, likeType) => {
        try {
            console.log(reference_code);
            console.log(likeType);
            const response = await http.post(
                `/api/video/like/${reference_code}`,
                {
                    like_dislike: likeType,
                }
            );
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    return { sendLike };
}
