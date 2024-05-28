import axios from "axios";
import authUser from "./authUser";
import useValidation from "./useValidation";
export default function useUserSettings() {
    const { http } = authUser();
    const { validateForm } = useValidation();

    const changeNickname = async (id, newUsername) => {
        try {
            const response = await http.post(`/api/auth/update/${id}`, {
                name: newUsername,
            });
            if (response.status === 200) {
                return true;
            }
        } catch (error) {
            if (error.response.status === 401) {
                console.log(error);
                const tempResponse = validateForm(
                    "accountSettings",
                    error.response.data.errors
                );
                return tempResponse;
            }
            console.log(error);
        }
    };

    const changePassword = async (
        id,
        prevPassword,
        newPassword,
        newPasswordRepeat
    ) => {
        try {
            const repsonse = await http.post(`/api/auth/update/${id}`, {
                currentPassword: prevPassword,
                password: newPassword,
                repeatPassword: newPasswordRepeat,
            });
            if (repsonse.status === 200) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            if (error.response.status === 401) {
                console.log(error);
                const response = validateForm(
                    "accountSettings",
                    error.response.data.errors
                );
                return response;
            }
            console.log(error);
        }
    };

    const changeAvatar = async (id, newAvatar) => {
        const formData = new FormData();
        formData.append("thumbnail", newAvatar);
        try {
            await http.post(`/api/auth/update/${id}`, formData);
        } catch (error) {
            console.log(error);
        }
    };

    return { changeNickname, changePassword, changeAvatar };
}
