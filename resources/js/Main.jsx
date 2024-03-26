import React from "react";
import { Route, Routes } from "react-router-dom";
import ForgotPasswordPage from "./components/ForgotPasswordPage/ForgotPasswordPage";
import Header from "./components/Header/Header";
import MainContent from "./components/MainContent/MainContent";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import LoginPage from "./components/LoginPage/LoginPage";
import UploadPage from "./components/UploadPage/UploadPage";
import authUser from "./components/authUser";

function Main() {
    const { getToken, isLogged } = authUser();

    
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <>
                        <Header /> <MainContent userIsLogged={false} />
                    </>
                }
            ></Route>
            <Route
                path="/account"
                element={
                    <>
                        <Header />
                        <MainContent userIsLogged={true} />
                    </>
                }
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgotPassword" element={<ForgotPasswordPage componentType={false}/>}></Route>
            <Route path="/upload" element={<UploadPage />}></Route>
            
        </Routes>
    );
}

export default Main;
