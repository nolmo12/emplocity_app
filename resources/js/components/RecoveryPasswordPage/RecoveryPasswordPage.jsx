import React from "react";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import authUser from "../authUser";

export default function RecoveryPasswordPage(){
    const { http, getCsrfToken } = authUser();
    const [data, setData] = useState({
        password: "",
        repeatPassword: "",
    });
    function handleInputPassword(e){
        setData({...data, password: e.target.value})
    }

    function handleInputRepeatPassword(e){
        setData({...data, repeatPassword: e.target.value})
    }

    const handleSubmit = () => {
        try{
            http.post("/api/reset-password", {
                token: getCsrfToken(), //fsdfsdfsdfsdfsd
                password: data.password,
            })
        }catch(error){
            console.log(error)
        }

    }
    return (
        <main>
            <form onSubmit={handleSubmit}>
            <input
                    id={styles.Password}
                    type="password"
                    placeholder="Password"
                    value={data.password}
                    onChange={(e) => handleInputPassword(e)}
                ></input>
                <input
                    id={styles.Password}
                    type="password"
                    placeholder="Repeat password"
                    value={data.repeatPassword}
                    onChange={(e) => handleInputRepeatPassword(e)}
                ></input>
                <button>Reset</button>
            </form>
        </main>
    )
    
}