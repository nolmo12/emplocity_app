import { useState } from "react";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom/client";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import Header from "./components/Header/Header";
import MainContent from "./components/MainContent/MainContent";
import RegisterOrLogin from "./components/RegisterOrLogin/RegisterOrLogin";
function Main() {
    const [isRegister, setIsRegister] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <Header /> <MainContent />
                        </>
                    }
                ></Route>
                <Route
                    path="/register"
                    element={<RegisterOrLogin componentType="register" />}
                />
                <Route
                    path="/login"
                    element={<RegisterOrLogin componentType="login" />}
                />
                <Route
                    path="/forgotPassword"
                    element={<ForgotPassword />}
                ></Route>
            </Routes>
        </Router>
    );
}

export default Main;

if (document.getElementById("root")) {
    const Index = ReactDOM.createRoot(document.getElementById("root"));

    Index.render(
        <React.StrictMode>
            <Main />
        </React.StrictMode>
    );
}
