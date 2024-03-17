import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import Header from "./components/Header/Header";
import MainContent from "./components/MainContent/MainContent";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import TempLogin from "./components/TempLogin/TempLogin";
import authUser from "./components/authUser";
function Main() {
    const { getToken, isLogged } = authUser();
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <>
                        <Header /> <MainContent />
                    </>
                }
            ></Route>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotPassword" element={<ForgotPassword />}></Route>
            <Route path="/logged" element={<TempLogin />}></Route>
        </Routes>
    );
}

export default Main;
