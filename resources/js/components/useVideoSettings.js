import authUser from "./authUser";
export default function useVideoSettings() {
    const { http } = authUser();
    const sendData = async (type, reference_code, data, e) => {
        e.preventDefault();
        try {
            if (type === "title") {
                await http.post(`/api/video/update`, {
                    title: data,
                    reference_code: reference_code,
                });
            } else if (type === "description") {
                await http.post(`/api/video/update`, {
                    description: data,
                    reference_code: reference_code,
                });
            } else if (type === "tags") {
                console.log("fsdfsdfsd");
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
                console.log(data);
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
            console.log(error);
        }
    };
    return { sendData };
}
