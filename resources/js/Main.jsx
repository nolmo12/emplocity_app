import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import UploadPage from "./components/UploadPage/UploadPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage/ResetPasswordPage";
import Header from "./components/Header/Header";
import MainContent from "./components/MainContent/MainContent";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import LoginPage from "./components/LoginPage/LoginPage";
import AccountSettings from "./components/AccountSettings/AccountSettings";
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
            <Route
                path="/account/:id"
                element={
                    <>
                        <Header />
                        <MainContent contentType="otherUser" />
                    </>
                }
            />

            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/forgotPassword"
                element={<ForgotPasswordPage />}
            ></Route>

            <Route
                path="/reset-password"
                element={<ResetPasswordPage />}
            ></Route>
            <Route path="/upload" element={<UploadPage />}></Route>
            <Route
                path="/search-result/:query"
                element={
                    <>
                        <Header />
                        <MainContent contentType="result" />
                    </>
                }
            ></Route>
            <Route
                path="/history/:userId"
                element={
                    <>
                        <Header />
                        <MainContent contentType="userHistory" />
                    </>
                }
            ></Route>
            <Route
                path="/user-likes/:userId"
                element={
                    <>
                        <Header />
                        <MainContent contentType="userLikes" />
                    </>
                }
            ></Route>
            <Route
                path="/help"
                element={
                    <>
                        <Header />
                        <MainContent contentType="help" />
                    </>
                }
            />
            <Route
                path="/video/:reference_code"
                element={
                    <>
                        <Header />
                        <MainContent contentType="video" />
                    </>
                }
            />
            <Route
                path="/account-settings"
                element={
                    <>
                        <Header />
                        <AccountSettings />
                    </>
                }
            />
        </Routes>
    );
}

export default Main;
