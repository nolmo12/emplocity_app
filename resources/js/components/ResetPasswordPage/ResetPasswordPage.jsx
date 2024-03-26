import React from "react";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import authUser from "../authUser";
import styles from "./registerOrLogin.module.css";

export default function ResetPasswordPage(){
    const { http, getCsrfToken } = authUser();
    const [data, setData] = useState({
        email: "",
        password: "",
        repeatPassword: "",
        token: "",
    });
    const [searchParams] = useSearchParams();

    useEffect(() => {
        setData({...data, email: searchParams.get("email"), token: searchParams.get("token")});
    }, [])

    function handleInputPassword(e){
        setData({...data, password: e.target.value})
    }

    function handleInputRepeatPassword(e){
        setData({...data, repeatPassword: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        getCsrfToken();
        try{
            console.log(data.email)
            console.log(data.token)
            console.log(data.password)
            console.log(data.repeatPassword)
            http.post("/api/reset-password", {
                email: data.email,
                token: data.token, //fsdfsdfsdfsdfsd
                password: data.password,
                repeatPassword: data.repeatPassword,
            })
        }catch(error){
            console.log(error)
        }

    }
    return (
        <main>
            <form onSubmit={handleSubmit}>
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
                    placeholder="Repeat Password"
                    value={data.repeatPassword}
                    onChange={(e) => handleInputRepeatPassword(e)}
                ></input>
                <button>Reset</button>
            </form>
        </main>
    )
    
}