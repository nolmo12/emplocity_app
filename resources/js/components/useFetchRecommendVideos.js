import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import authUser from "./authUser";
export default function useFetchRecommendVideos({ pageNumber }) {
    const [videos, setVideos] = useState([]);
    const [tagCount, setTagCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { tag } = useParams();
    const { userId } = useParams();
    const { http } = authUser();
    useEffect(() => {
        setVideos([]);
        const fetchVideos = async () => {
            try {
                setVideos([]);
                const response = await axios.get(
                    `/api/video/listing?page=${pageNumber}`
                );
                response.data.data.map((video) => {
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
                const response = await axios.get(`/api/auth/read/${userId}`);
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
                setVideos([]);
                const response = await axios.get(`/api/tags/${tag}`);
                const tagResponse = await axios.get(`/api/tags/count/${tag}`);
                const tempVideos = [];
                response.data.map((video) => {
                    tempVideos.push(video);
                });
                setVideos(tempVideos);
                if (tagResponse.data) setTagCount(tagResponse.data.video_count);
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

    const fetchNextVideos = async (
        pageNumber,
        noMoreVideosFlag,
        setNoMoreVideosFlag
    ) => {
        try {
            if (noMoreVideosFlag) {
                return;
            } else {
                const response = await http.get(
                    `/api/video/listing?page=${pageNumber}`
                );
                if (response.data.data.length === 0) {
                    setNoMoreVideosFlag(true);
                    return;
                } else {
                    response.data.data.map((video) => {
                        setVideos((videos) => [...videos, video]);
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };

    return { videos, tagCount, isLoading, fetchNextVideos };
}
