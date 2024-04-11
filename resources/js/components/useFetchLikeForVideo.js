import axios from "axios";
import { useState, useEffect } from "react";
import authUser from "./authUser";
export default function useFetchLikeForVideo() {
    const { http } = authUser();
    const fetchLikes = async (reference_code, likeType) => {
        try {
            const response = await http.get(
                `/api/video/getUserLikes/${reference_code}`
            );
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };
    return { fetchLikes };
}
