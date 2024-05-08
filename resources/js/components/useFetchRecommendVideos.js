import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import authUser from "./authUser";
export default function useFetchRecommendVideos({ offset }) {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { tag } = useParams();
    const { userId } = useParams();
    const { http } = authUser();
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setVideos([]);
                const response = await axios.get(`/api/video/listing`);
                response.data.map((video) => {
                    setVideos((videos) => [...videos, video]);
                });
                // setIsLoading(false);
            } catch (error) {
                console.log(error);
            }
            setIsLoading(false);
        };
        const fetchOtherUserVideos = async (userId) => {
            try {
                const response = await axios.get(`/api/auth/read/${userId}`); // http => axios
                const tempVideos = [];
                response.data.videos.map((video) => {
                    tempVideos.push(video);
                });
                setVideos(tempVideos);
                // setIsLoading(false);
            } catch (error) {
                console.log(error);
            }
            setIsLoading(false);
        };

        const fetchVideosOnTag = async (tag) => {
            try {
                const response = await axios.get(`/api/video/${tag}`);
                const tempVideos = [];
                response.data.map((video) => {
                    tempVideos.push(video);
                });
                setVideos(tempVideos);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        if (userId) {
            fetchOtherUserVideos(userId);
        } else if (tag) {
            fetchVideosOnTag(tag);
        } else {
            fetchVideos();
        }
    }, [userId, tag]);

    return { videos, isLoading };
}
