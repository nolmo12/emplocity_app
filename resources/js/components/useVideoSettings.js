import authUser from "./authUser";
export default function useVideoSettings() {
    const { http, setError } = authUser();
    const sendData = async (type, reference_code, data, setData, e) => {
        e.preventDefault();
        try {
            if (type === "title") {
                await http.post(`/api/video/update`, {
                    title: data,
                    reference_code: reference_code,
                });
                setData((prev) => ({ ...prev, title: "" }));
                e.target.previousElementSibling.value = "";
            } else if (type === "description") {
                await http.post(`/api/video/update`, {
                    ...(data && { description: data }),
                    reference_code: reference_code,
                });
                setData((prev) => ({ ...prev, description: "" }));
                e.target.previousElementSibling.value = "";
            } else if (type === "tags") {
                await http.post(`/api/video/update`, {
                    tags: data,
                    reference_code: reference_code,
                });
            } else if (type === "visibility") {
                await http.post(`/api/video/update`, {
                    visibility: data,
                    reference_code: reference_code,
                });
            } else if (type === "thumbnail") {
                const formData = new FormData();
                formData.append("thumbnail", data.get("thumbnail"));
                formData.append("reference_code", reference_code);
                await http.post(`/api/video/update`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }
        } catch (error) {
            setError(error);
        }
    };
    return { sendData };
}
