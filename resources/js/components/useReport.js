import { useNavigate } from "react-router-dom";
import authUser from "./authUser";
export default function useReport() {
    const { http } = authUser();
    const navigate = useNavigate();
    const sendReport = async (type, reference_code, content) => {
        try {
            if (type === "video") {
                const response = await http.post(
                    `/api/report/video/${reference_code}?description=${content}`
                );
                navigateUser(response, type, reference_code);
            } else if (type === "user") {
                const response = await http.post(
                    `/api/report/user?description=${content}&id=${reference_code}`
                );
                navigateUser(response, type, reference_code);
            } else if (type === "comment") {
                const response = await http.post(
                    `/api/report/comment/?description=${content}&id=${reference_code}`
                );
                navigateUser(response, type, reference_code);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const navigateUser = (response, type, reference_code) => {
        if (response.status === 200 && type === "user") {
            navigate(`/user/${reference_code}`);
        } else if (
            (response.status === 200 && type === "video") ||
            type === "comment"
        ) {
            navigate(`/video/${reference_code}`);
        }
    };
    return { sendReport };
}
