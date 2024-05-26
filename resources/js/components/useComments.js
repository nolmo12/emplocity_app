import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authUser from "./authUser";
import { offset } from "@popperjs/core";

export default function useComments() {
    const navigate = useNavigate();
    const { http } = authUser();
    const [commentsObj, setCommentsObj] = useState({ comments: [] });

    const fetchVideosSets = async (reference_code, offsetInt) => {
        const response = await http.get(
            `/api/video/comments?reference_code=${reference_code}&offset=${offsetInt}`
        );
        if (offsetInt === 0) {
            setCommentsObj(response.data);
        } else if (offsetInt > 0) {
            setCommentsObj((prev) => ({
                ...prev,
                comments: [...prev.comments, ...response.data.comments],
            }));
        }
        return response;
    };

    const sendComment = async (reference_code, content) => {
        await http.post(`/api/video/comment`, {
            reference_code: reference_code,
            content: content,
        });
    };

    const sendReplyComment = async (reference_code, content, parentId) => {
        await http.post(`/api/video/comment`, {
            reference_code: reference_code,
            content: content,
            parent: parentId,
        });
    };

    const deleteComment = async (id) => {
        await http.delete(`/api/video/comment/delete?comment=${id}`);
    };

    const editComment = async (id, content) => {
        await http.patch(`/api/video/comment/update`, {
            comment: id,
            content: content,
        });
    };

    return {
        fetchVideosSets,
        sendComment,
        commentsObj,
        setCommentsObj,
        deleteComment,
        sendReplyComment,
        editComment,
    };
    // const response = await http.get(
    //     `/api/video/comments?reference_code=${reference_code}&offset=${offsetValue}`
    // );
    // const response = await http.get(
    //     `/api/video/comments?reference_code=${reference_code}&offset=${offset.current}`
    // );
    // await http.post(`/api/video/comment`, {
    //     reference_code: reference_code,
    //     content: content,
    //     parent: parentId,
    // });
    // const response = await http.get(
    //     `/api/video/comments/children?comment=${parentId}&offset=0`
    // );
    // await http.patch(`/api/video/comment/update`, {
    //     comment: parentId,
    //     content: content,
    // });
    // await http.delete(`/api/video/comment/delete?comment=${id}`);
}
