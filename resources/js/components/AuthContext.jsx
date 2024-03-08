import { createContext, useContext, useState } from "react";
import axios from "./axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const csrf = async () => {
        await axios.get("/sanctum/csrf-cookie");
    };

    const getUser = async () => {
        try {
            const { data } = await axios.get("/api/user");
            setUser(data);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const login = async (email, password) => {
        await csrf();
        try {
            const response = await axios.post("/api/auth/login", { email, password });
            const { token } = response.data;
            // Store the token in local storage or wherever you prefer
            localStorage.setItem("token", token);
            await getUser();
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const register = async (email, password, repeatPassword) => {
        await csrf();
        try {
            const response = await axios.post("/api/auth/register", { email, password, repeatPassword });
            const { token } = response.data;
            // Store the token in local storage or wherever you prefer
            localStorage.setItem("token", token);
            await getUser();
            navigate("/");
        } catch (error) {
            console.error("Registration failed:", error);
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
