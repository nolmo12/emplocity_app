import axios from "axios";
import { useNavigate } from "react-router-dom";
import authUser from "./authUser";

export default function useComments() {
    const navigate = useNavigate();
    const { http } = authUser();

    const fetchComments = async (reference_code, offset) => {
        try {
            const response = await http.get(
                `/api/video/comments?reference_code=${reference_code}&offset=${offset}`
            );
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    const sendComment = async (reference_code, content) => {
        try {
            await http.post(`/api/video/comment`, {
                reference_code: reference_code,
                content: content.replace(/\n/g, "<br>"),
            });
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

    // ---------------------------------------------------

    return {
        fetchComments,
        sendComment,
        sendReplyComment,
        fetchChildren,
        editComment,
        deleteComment,
    };
}
