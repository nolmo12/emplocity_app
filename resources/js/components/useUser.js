import authUser from "./authUser";
import useComments from "./useComments";
import { useNavigate } from "react-router-dom";
export default function useUser() {
    const { http, getToken, isLogged } = authUser();
    const { deleteComment } = useComments();
    const navigate = useNavigate();

    http.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${getToken()}`;
        return config;
    });

    const getUser = async () => {
        if (isLogged()) {
            try {
                const response = await http.get("/api/user");
                return response.data;
            } catch (error) {
                console.log(error);
            }
        }
    };

    const isAdmin = async () => {
        if (isLogged()) {
            const user = await getUser();
            if (user.id && user.id === 1) {
                return true;
            }
            return false;
        }
    };

    const removeVideo = async (reference_code) => {
        try {
            await http.delete(`/api/video/delete`, {
                params: { reference_code: reference_code },
            });
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    const removeUser = async (id) => {
        try {
            await http.delete(`/api/auth/delete/${id}`);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    const removeComment = async (setRenderKey, id) => {
        try {
            await deleteComment(id);
            setRenderKey((prev) => prev + 1);
        } catch (error) {
            console.log(error);
        }
    };

    return { getUser, isAdmin, removeVideo, removeUser, removeComment };
}
