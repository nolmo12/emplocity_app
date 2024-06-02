import axios from "axios";
import authUser from "./authUser";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function useFetchVideo({ reference_code }) {
    const [videoObj, setVideoObj] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { http } = authUser();
    const { baseUrl } = config();

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await axios.get(
                    `${baseUrl}/api/video/watch/${reference_code}`
                );
                setVideoObj(response.data);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        };
        fetchVideo();
    }, [reference_code]);

    const getVideoLink = async (t) => {
        try {
            const response = await http.put(
                `/api/video/getUrl?reference_code=${reference_code}&time=${
                    Math.floor(t) || 0
                }&original_url=video/${reference_code}`
            );
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    const followUser = async (id) => {
        await http.post(`/api/auth/follow?creator_id=${id}`);
    };

    const unfollowUser = async (id) => {
        await http.post(`/api/auth/unfollow?creator_id=${id}`);
    };

    const checkFollow = async (id) => {
        if (id) {
            try {
                const response = await http.get(`/api/auth/isFollowing/${id}`);
                return response.data;
            } catch (error) {
                console.log(error);
            }
        }
    };

    const downloadVideo = async () => {
        try {
            const response = await http.get(
                `/api/video/download/${reference_code}`
            );
            if (response.status === 200)
                window.open(`${baseUrl}/api/video/download/${reference_code}`);
        } catch (error) {
            console.log(error);
        }
    };
    return {
        videoObj,
        isLoading,
        followUser,
        unfollowUser,
        checkFollow,
        getVideoLink,
        downloadVideo,
    };
}
