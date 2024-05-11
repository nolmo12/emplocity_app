import authUser from "./authUser";
export default function useUser() {
    const { http, getToken } = authUser();
    http.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${getToken()}`;
        return config;
    });
    const getUser = async () => {
        try {
            const response = await http.get("/api/user");
            return response.data;
        } catch (error) {
            // console.log(error);
        }
    };
    return { getUser };
}
