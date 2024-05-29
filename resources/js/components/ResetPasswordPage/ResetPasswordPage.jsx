import React from "react";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Message from "../Message/Message";
import authUser from "../authUser";
import styles from "./resetPasswordPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function ResetPasswordPage() {
    const { http, getCsrfToken } = authUser();
    const [data, setData] = useState({
        email: "",
        password: "",
        repeatPassword: "",
        token: "",
    });
    const [isReset, setIsReset] = useState(false);
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
        http.post("/api/reset-password", {
            email: data.email,
            token: data.token, //fsdfsdfsdfsdfsd
            password: data.password,
            repeatPassword: data.repeatPassword,
        })
            .then((response) => {
                setIsReset(true);
            })
            .catch((error) => {
                console.log(error);
                setPasswordValidation(true);
            });
    };
    return (
        <main>
            {isReset ? (
                <Message
                    message="Password was change"
                    className={styles.Message}
                />
            ) : (
                <form onSubmit={handleSubmit} className={styles.resetForm}>
                    <h1>Enter your new password</h1>
                    <div>
                        <FontAwesomeIcon
                            icon={faLock}
                            className={styles.resetPassIcon}
                        />
                        <input
                            id={styles.Password}
                            type="password"
                            placeholder="Password"
                            value={data.password}
                            onChange={(e) => handleInputPassword(e)}
                        ></input>
                    </div>
                    <div>
                        <FontAwesomeIcon
                            icon={faLock}
                            className={styles.resetPassIcon}
                        />
                        <input
                            id={styles.repeatPassword}
                            type="password"
                            placeholder="Repeat password"
                            value={data.repeatPassword}
                            onChange={(e) => handleInputRepeatPassword(e)}
                        ></input>
                    </div>
                    {passwordValidation ? (
                        <p data-testid="passwordRequirements">
                            The password must contain at least 9 characters
                        </p>
                    ) : (
                        ""
                    )}
                    <button>Reset</button>
                </form>
            )}
        </main>
    );
}
