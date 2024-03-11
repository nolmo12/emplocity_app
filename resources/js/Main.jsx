import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom/client";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import Header from "./components/Header/Header";
import MainContent from "./components/MainContent/MainContent";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import TempLogin from "./components/TempLogin/TempLogin";
import AuthUser from "./components/AuthUser";

function Main() {
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
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/forgotPassword"
                    element={<ForgotPassword />}
                ></Route>
                <Route path="/logged" element={<TempLogin />}></Route>
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
