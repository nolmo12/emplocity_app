import axios from "axios";
import { useState, useEffect } from "react";
import authUser from "./authUser";
export default function useLike({ reference_code, likeType }) {
    const { http } = authUser();
    useEffect(() => {
        const fetchLike = async () => {
            try {
                const response = await http.post(
                    `/api/video/like/${reference_code}`,
                    {
                        like_dislike: likeType,
                    }
                );
            } catch (error) {
                console.log(error);
            }
        };
        fetchLike();
    }, [reference_code]);
}
