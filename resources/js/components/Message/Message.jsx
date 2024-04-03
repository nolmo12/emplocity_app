import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./message.module.css";

export default function Message({ message }) {
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate("/");
    };

    return (
        <div className={styles.postSendMessage}>
            <p>{message}</p>
            <button onClick={handleSubmit}>Okay</button>
        </div>
    );
}
