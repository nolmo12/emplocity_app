import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import authUser from "./authUser";

export default function useComments() {
    const navigate = useNavigate();
    const { http } = authUser();
    const [commentsObj, setCommentsObj] = useState();
    const offset = useRef(0);

    const fetchComments = async (reference_code, offsetValue) => {
        try {
            const response = await http.get(
                `/api/video/comments?reference_code=${reference_code}&offset=${offsetValue}`
            );
            setCommentsObj(response.data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    const fetchNextComments = async (reference_code) => {
        try {
            const tempOffset = offset.current + 1;

            const response = await http.get(
                `/api/video/comments?reference_code=${reference_code}&offset=${tempOffset}`
            );

            if (response.data.comments.length !== 0) {
                offset.current += 1;
            }
            setCommentsObj((prev) => ({
                ...prev,
                comments: [...prev.comments, ...response.data.comments],
            }));

            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    const sendComment = async (reference_code, content) => {
        try {
            await http.post(`/api/video/comment`, {
                reference_code: reference_code,
                content: content,
            });
            const response = await http.get(
                `/api/video/comments?reference_code=${reference_code}&offset=0`
            );
            setCommentsObj(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const sendReplyComment = async (reference_code, content, parentId) => {
        try {
            await http.post(`/api/video/comment`, {
                reference_code: reference_code,
                content: content,
                parent: parentId,
            });
            const response = await http.get(
                `/api/video/comments?reference_code=${reference_code}&offset=0`
            );
            setCommentsObj(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchChildren = async (parentId) => {
        try {
            const response = await http.get(
                `/api/video/comments/children?comment=${parentId}&offset=0`
            );
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    const editComment = async (parentId, content) => {
        try {
            await http.patch(`/api/video/comment/update`, {
                comment: parentId,
                content: content,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const deleteComment = async (id) => {
        try {
            await http.delete(`/api/video/comment/delete?comment=${id}`);
        } catch (error) {
            console.log(error);
        }
    };

    return {
        fetchComments,
        sendComment,
        sendReplyComment,
        fetchChildren,
        editComment,
        deleteComment,
        fetchNextComments,
        commentsObjFrom: commentsObj,
        setCommentsObjFrom: setCommentsObj,
        offset,
    };
}
