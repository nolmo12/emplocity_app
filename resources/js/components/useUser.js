import authUser from "./authUser";
import useComments from "./useComments";
import { useNavigate } from "react-router-dom";
export default function useUser() {
    const { http, isLogged, logout, getUser } = authUser();
    const { deleteComment } = useComments();
    const navigate = useNavigate();

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
            navigate("/home");
        } catch (error) {
            console.log(error);
        }
    };

    const removeUser = async (id) => {
        try {
            await http.delete(`/api/auth/delete`, { params: { user_id: id } });
            navigate("/home");
            logout();
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

    return { isAdmin, removeVideo, removeUser, removeComment };
}
