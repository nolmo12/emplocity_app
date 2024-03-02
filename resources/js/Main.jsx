import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header/Header";
import MainContent from "./components/MainContent/MainContent";

function Main() {
    return (
        <>
            <Header />
            <MainContent />
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
