import axios from "axios";
import { useState, useEffect } from "react";
import authUser from "./authUser";
export default function useLike({ reference_code, likeType }) {
    const { http } = authUser();
    const [likeObj, setLikeObj] = useState({});
    useEffect(() => {
        const fetchLike = async () => {
            try {
                const response = await http.post(
                    `/api/video/like/${reference_code}`,
                    {
                        like_dislike: likeType,
                    }
                );
                setLikeObj(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchLike();
    }, [reference_code]);

    return likeObj;
}
