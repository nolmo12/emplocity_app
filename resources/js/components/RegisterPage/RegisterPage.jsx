import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Message from "../Message/Message";
import useValidation from "../useValidation";
import fetchImage from "../fetchImgFromStorage";
import styles from "./registerOrLogin.module.css";

export default function RegisterPage() {
    const [registeredData, setRegisteredData] = useState({
        email: "",
        password: "",
        repeatPassword: "",
    });
    const [emailVerification, setEmailVerification] = useState(false);
    const [iconPath, setIconPath] = useState("");
    const [validationInfo, setValidationInfo] = useState(null);
    const { validateForm } = useValidation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const iconPath = await fetchImage("ico.png");
                setIconPath(iconPath);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    function handleInputEmail(e) {
        setRegisteredData({ ...registeredData, email: e.target.value });
    }

    function handleInputPassword(e) {
        setRegisteredData({ ...registeredData, password: e.target.value });
    }

    function handleInputRepeatPassword(e) {
        setRegisteredData({
            ...registeredData,
            repeatPassword: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost/api/auth/register",
                {
                    email: registeredData.email,
                    password: registeredData.password,
                    repeatPassword: registeredData.repeatPassword,
                }
            );
            setEmailVerification(true);
        } catch (error) {
            console.log(error);
            const errors = error.response.data.errors;
            const validationResult = validateForm("register", errors);
            setValidationInfo(validationResult);
        }
    };

    return (
        <main>
            {emailVerification ? (
                <Message message="Email verification sent" />
            ) : (
                <form data-testid="form" onSubmit={handleSubmit}>
                    <Link to="/">
                        {iconPath && <img src={iconPath} alt="Icon" />}
                    </Link>

                    <input
                        id={styles.Email}
                        className={
                            validationInfo && validationInfo.emailValidation
                                ? styles.invalid
                                : ""
                        }
                        type="text"
                        placeholder="Email"
                        value={registeredData.email}
                        onChange={handleInputEmail}
                    />

                    {validationInfo && validationInfo.emailValidation && (
                        <p>Invalid or used by other user</p>
                    )}

                    <input
                        id={styles.Password}
                        className={
                            validationInfo && validationInfo.passwordValidation
                                ? styles.invalid
                                : ""
                        }
                        type="password"
                        placeholder="Password"
                        value={registeredData.password}
                        onChange={handleInputPassword}
                    />

                    {validationInfo && validationInfo.passwordValidation && (
                        <p>Invalid password</p>
                    )}

                    <input
                        id={styles.RepeatPassword}
                        className={
                            validationInfo &&
                            validationInfo.repeatPasswordValidation
                                ? styles.invalid
                                : ""
                        }
                        type="password"
                        placeholder="Repeat password"
                        value={registeredData.repeatPassword}
                        onChange={handleInputRepeatPassword}
                    />

                    {validationInfo &&
                        validationInfo.repeatPasswordValidation && (
                            <p>Not same as password</p>
                        )}

                    <button>Register</button>

                    <Link to="/login">I already have an account</Link>
                </form>
            )}
        </main>
    );
}
