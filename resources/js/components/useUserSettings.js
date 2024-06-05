import axios from "axios";
import authUser from "./authUser";
import useValidation from "./useValidation";
export default function useUserSettings() {
    const { http, setError } = authUser();
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
                const tempResponse = validateForm(
                    "accountSettings",
                    error.response.data.errors
                );
                return tempResponse;
            }
            setError(error);
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
            }
        } catch (error) {
            if (error.response.status === 401) {
                const errorResponse = validateForm(
                    "accountSettings",
                    error.response.data.message
                );

                return errorResponse;
            }
        }
    };

    const changeAvatar = async (id, newAvatar) => {
        const formData = new FormData();
        formData.append("thumbnail", newAvatar);
        try {
            await http.post(`/api/auth/update/${id}`, formData);
        } catch (error) {
            setError(error);
        }
    };

    return { changeNickname, changePassword, changeAvatar };
}
