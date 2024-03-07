import { createContext, useContext, useState } from "react";
import axios from "./axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const csrf = () => axios.get("/sanctum/csrf-cookie");
    const getUser = async () => {
        const { data } = await axios.get("/login");
        setUser(data);
    };

    const login = async ({ ...data }) => {
        await csrf();
        try {
            await axios.post("/login", data);
            getUser();
            navigate("/");
        } catch (e) {
            console.error(e);
        }
    };

    const register = async ({ ...data }) => {
        await csrf();
        try {
            await axios.post("/register", data);
            getUser();
            navigate("/");
        } catch (e) {
            console.error(e);
        }
    };
    return (
        <AuthContext.Provider value={{ user, getUser, login, register }}>
            {children}
        </AuthContext.Provider>
    );
};
export default function useAuthContext() {
    return useContext(AuthContext);
}
