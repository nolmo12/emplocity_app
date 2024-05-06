import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import UploadPage from "./components/UploadPage/UploadPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage/ResetPasswordPage";
import Header from "./components/Header/Header";
import AboutUs from "./components/AboutUs/AboutUs";
import MainContent from "./components/MainContent/MainContent";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import LoginPage from "./components/LoginPage/LoginPage";
import AccountSettings from "./components/AccountSettings/AccountSettings";
import authUser from "./components/authUser";
import Footer from "./components/Footer/Footer";

function Main() {
    const { getToken, isLogged } = authUser();
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <>
                        <Header />
                        <MainContent contentType="guest" />
                        <Footer />
                    </>
                }
            ></Route>
            <Route
                path="/account"
                element={
                    <>
                        <Header />
                        <MainContent contentType="logged" />
                        <Footer />
                    </>
                }
            />
            <Route
                path="/account/:id"
                element={
                    <>
                        <Header />
                        <MainContent contentType="otherUser" />
                        <Footer />
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
            <Route
                path="/upload"
                element={
                    <>
                        <Header />
                        <UploadPage />
                        <Footer />
                    </>
                }
            ></Route>
            <Route
                path="/search-result/:query/:sortType"
                element={
                    <>
                        <Header />
                        <MainContent contentType="result" />
                        <Footer />
                    </>
                }
            ></Route>
            <Route
                path="/history/:userId"
                element={
                    <>
                        <Header />
                        <MainContent contentType="userHistory" />
                        <Footer />
                    </>
                }
            ></Route>
            <Route
                path="/user-likes/:userId"
                element={
                    <>
                        <Header />
                        <MainContent contentType="userLikes" />
                        <Footer />
                    </>
                }
            ></Route>
            <Route
                path="/help"
                element={
                    <>
                        <Header />
                        <MainContent contentType="help" />
                        <Footer />
                    </>
                }
            />
            <Route
                path="/video/:reference_code"
                element={
                    <>
                        <Header />
                        <MainContent contentType="video" />
                        <Footer />
                    </>
                }
            />
            <Route
                path="/account-settings"
                element={
                    <>
                        <Header />
                        <AccountSettings />
                        <Footer />
                    </>
                }
            />
            <Route
                path="/:userId"
                element={
                    <>
                        <Header />
                        <MainContent contentType="otherUser" />
                        <Footer />
                    </>
                }
            ></Route>
            <Route
                path="/shop"
                element={
                    <>
                        <Header />
                        <MainContent contentType="shop" />
                        <Footer />
                    </>
                }
            ></Route>
            <Route
                path="/about-us"
                element={
                    <>
                        <Header />
                        <MainContent contentType="aboutUs" />
                    </>
                }
            />
            <Route
                path="/rules"
                element={
                    <>
                        <Header />
                        <MainContent contentType="rules" />
                    </>
                }
            />
        </Routes>
    );
}

export default Main;
