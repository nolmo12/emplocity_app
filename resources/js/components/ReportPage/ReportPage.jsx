import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function ReportPage({ id }) {
    const [email, setEmail] = useState("");
    const [content, setContent] = useState("");
    // when type is "user" reference_code is user_id,  when type is "comment" reference_code is comment_id
    const { type, reference_code } = useParams();
    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    };
    const handleChangeTextarea = (e) => {
        setContent(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email, content);
    };
    return (
        <main>
            <h3>{type} report</h3>
            {type === "video" && <p>Video Reference code: {reference_code}</p>}
            {type === "user" && <p>User ID: {reference_code}</p>}
            {type === "comment" && <p>Comment ID: {reference_code}</p>}
            <form onSubmit={(e) => handleSubmit(e)}>
                <input
                    onChange={(e) => handleChangeEmail(e)}
                    type="text"
                    placeholder="Email"
                />
                <textarea
                    onChange={(e) => handleChangeTextarea(e)}
                    placeholder="Describe your problem"
                />
                <button>Send</button>
            </form>
        </main>
    );
}
