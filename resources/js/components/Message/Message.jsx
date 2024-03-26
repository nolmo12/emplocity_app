import React from "react";
import { useNavigate } from "react-router-dom";

export default function Message({ message }) {
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate("/");
    };

    return (
        <div>
            <p>{message}</p>
            <button onClick={handleSubmit}>Okay</button>
        </div>
    );
}
