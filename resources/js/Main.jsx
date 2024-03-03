import { useState } from "react";
import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header/Header";
import MainContent from "./components/MainContent/MainContent";
import RegisterOrLogin from "./components/RegisterOrLogin/RegisterOrLogin";
function Main() {
    const [isRegister, setIsRegister] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    function handleRegisterClick() {
        setIsRegister(true);
        setIsLogin(false);
    }

    function handleLoginClick() {
        setIsRegister(false);
        setIsLogin(true);
    }

    const componentType = isRegister ? "register" : "login";

    return (
        <>
            {isRegister && <RegisterOrLogin componentType={componentType} />}
            {isLogin && <RegisterOrLogin componentType={componentType} />}
            {!isRegister && !isLogin && (
                <>
                    <Header
                        onRegisterClick={handleRegisterClick}
                        onLoginClick={handleLoginClick}
                    />
                    <MainContent />
                </>
            )}
        </>
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
