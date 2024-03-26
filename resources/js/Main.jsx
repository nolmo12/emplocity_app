import React from "react";
import { Route, Routes } from "react-router-dom";
import UploadPage from "./components/UploadPage/UploadPage"
import ForgotPasswordPage from "./components/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage/ResetPasswordPage";
import Header from "./components/Header/Header";
import MainContent from "./components/MainContent/MainContent";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import LoginPage from "./components/LoginPage/LoginPage";
import authUser from "./components/authUser";

function Main() {
    const { getToken, isLogged } = authUser();

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <>
                        <Header /> <MainContent contentType="guest" />
                    </>
                }
            ></Route>
            <Route
                path="/account"
                element={
                    <>
                        <Header />
                        <MainContent contentType="logged" />
                    </>
                }
            />

            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgotPassword" element={<ForgotPasswordPage />}></Route>

            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/forgotPassword"
                element={<ForgotPasswordPage componentType={false} />}
            ></Route>
            <Route
                path="/reset-password"
                element={<ResetPasswordPage />}
            ></Route>
            <Route path="/upload" element={<UploadPage />}></Route>
            <Route
                path="/search-result"
                element={<>
                <Header />
                <MainContent contentType="result" />
                </>}
            ></Route>

        </Routes>
    );
}

export default Main;
