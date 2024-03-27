import React from "react";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Message from "../Message/Message";
import authUser from "../authUser";
import styles from "./registerOrLogin.module.css";

export default function ResetPasswordPage() {
    const { http, getCsrfToken } = authUser();
    const [data, setData] = useState({
        email: "",
        password: "",
        repeatPassword: "",
        token: "",
    });
    const [isReset, setIsReset] = useState(false)
    const [passwordValidation, setPasswordValidation] = useState(false);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        setData({
            ...data,
            email: searchParams.get("email"),
            token: searchParams.get("token"),
        });
    }, []);

    function handleInputPassword(e) {
        setData({ ...data, password: e.target.value });
    }

    function handleInputRepeatPassword(e) {
        setData({ ...data, repeatPassword: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        getCsrfToken();
        try {
            console.log(data.email);
            console.log(data.token);
            console.log(data.password);
            console.log(data.repeatPassword);
            http.post("/api/reset-password", {
                email: data.email,
                token: data.token, //fsdfsdfsdfsdfsd
                password: data.password,
                repeatPassword: data.repeatPassword,
            });
            setIsReset(true);
        } catch (error) {
            passwordValidation(true)
            console.log(error);
        }
    };
    return (
        <main>
            {isReset ? (<Message message="Password was change" className={styles.Message}/>) : <form onSubmit={handleSubmit}>
                <h1>Enter your new password</h1>
                <input
                    id={styles.Password}
                    type="password"
                    placeholder="Password"
                    value={data.password}
                    onChange={(e) => handleInputPassword(e)}
                ></input>
                <input
                    id={styles.repeatPassword}
                    type="password"
                    placeholder="Repeat password"
                    value={data.repeatPassword}
                    onChange={(e) => handleInputRepeatPassword(e)}
                ></input>
                {passwordValidation ? <p>The password must contain at least 8 characters</p> : ""}
                <button>Reset</button>
            </form>}
            
        </main>
    );
}
