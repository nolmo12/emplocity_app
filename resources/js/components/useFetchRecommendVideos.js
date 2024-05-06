import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import authUser from "./authUser";
export default function useFetchRecommendVideos() {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { otherUserName } = useParams();
    console.log(otherUserName);
    const { http } = authUser(); // video fetching for other users
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get("/api/video/listing");
                response.data.map((video) => {
                    setVideos((videos) => [...videos, video]);
                });
                setIsLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        const fetchOtherUserVideos = async (userId) => {
            try {
                const response = await axios.get(`/api/auth/read/${userId}`);
                console.log(response.data);
                response.data.map((video) => {
                    setVideos((videos) => [...videos, video]);
                });

                setIsLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        if (otherUserName) {
            fetchOtherUserVideos(id);
        } else {
            fetchVideos();
        }
    }, []);

    return { videos, isLoading };
}
