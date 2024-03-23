import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import fetchImage from "../fetchImgFromStorage";
import styles from "./forgotPassword.module.css";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [message, setMessage] = useState("");
    const [iconPath, setIconPath] = useState("");
    const navigate = useNavigate();

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
        setEmail(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); // wait for backend
        if (isValid) {
            setMessage(
                "Email will be sent, you will be redirected to the login page"
            );
            setInterval(() => {
                navigate("/login");
            }, 4000);
        }
    };

    return (
        <main>
            <form onSubmit={handleSubmit}>
                <Link to="/">
                    {iconPath && <img src={iconPath} alt="Icon"></img>}
                </Link>
                <input
                    type="text"
                    onChange={(e) => handleInputEmail(e)}
                    placeholder="Email"
                ></input>
                {message && <p>{message}</p>}
                <button>Send</button>
            </form>
        </main>
    );
}
