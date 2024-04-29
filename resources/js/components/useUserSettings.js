import axios from "axios";
import authUser from "./authUser";
export default function useUserSettings() {
    const { http } = authUser();

    const changeNickname = async (id, newUsername) => {
        try {
            await http.patch(`/api/auth/update/${id}`, {
                name: newUsername,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const changePassword = async (id, newPassword, newPasswordRepeat) => {
        try {
            await http.patch(`/api/auth/update/${id}`, {
                password: newPassword,
                repeatPassword: newPasswordRepeat,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const changeAvatar = async (id, newAvatar) => {
        const formData = new FormData();
        formData.append("thumbnail", newAvatar);
        try {
            await http.patch(`/api/auth/update/${id}`, formData);
        } catch (error) {
            console.log(error);
        }
    };

    return { changeNickname, changePassword, changeAvatar };
}
