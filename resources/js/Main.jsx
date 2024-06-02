import React, { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import UploadPage from "./components/UploadPage/UploadPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage/ResetPasswordPage";
import Header from "./components/Header/Header";
import ReportPage from "./components/ReportPage/ReportPage";
import AboutUs from "./components/AboutUs/AboutUs";
import MainContent from "./components/MainContent/MainContent";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import LoginPage from "./components/LoginPage/LoginPage";
import AccountSettings from "./components/AccountSettings/AccountSettings";
import authUser from "./components/authUser";
import Footer from "./components/Footer/Footer";
import axios from "axios";
import config from "./config";

function Main() {
    return (
        <Routes>
            <Route
                path={"/"}
                element={
                    <>
                        <Header />
                        <MainContent contentType="guest" />
                        <Footer />
                    </>
                }
            ></Route>
            <Route
                path={"/home"}
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

            <Route
                path="/register"
                element={
                    <>
                        <RegisterPage />
                        <Footer />
                    </>
                }
            />
            <Route
                path="/login"
                element={
                    <>
                        <LoginPage />
                        <Footer />
                    </>
                }
            ></Route>
            <Route
                path="/forgotPassword"
                element={
                    <>
                        <ForgotPasswordPage />
                        <Footer />
                    </>
                }
            ></Route>

            <Route
                path="/reset-password"
                element={<ResetPasswordPage />}
            ></Route>
            <Route
                path="/upload"
                element={
                    <>
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
                path={"/follows/:userId"}
                element={
                    <>
                        <Header />
                        <MainContent contentType="userFollows" />
                        <Footer />
                    </>
                }
            />
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
                path="/video/:reference_code/:time?"
                element={
                    <>
                        <Header />
                        <MainContent contentType="video" />
                        <Footer />
                    </>
                }
            />
            <Route
                path="/tag/:tag"
                element={
                    <>
                        <Header />
                        <MainContent contentType="tag" />
                        <Footer />
                    </>
                }
            />
            <Route
                path="/account-settings"
                element={
                    <>
                        <AccountSettings />
                        <Footer />
                    </>
                }
            />
            <Route
                path="/user/:userId"
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
                        <Footer />
                    </>
                }
            />
            <Route
                path="/rules"
                element={
                    <>
                        <Header />
                        <MainContent contentType="rules" />
                        <Footer />
                    </>
                }
            />
            <Route
                path="/report/:type/:reference_code"
                element={
                    <>
                        <ReportPage />
                        <Footer />
                    </>
                }
            />
            <Route
                path="/video-settings/:reference_code"
                element={
                    <>
                        <MainContent contentType="videoSettings" />
                        <Footer />
                    </>
                }
            />
        </Routes>
    );
}

export default Main;
