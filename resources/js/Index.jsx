import React from "react";
import ReactDOM from "react-dom/client";
import Main from "./Main";
import { BrowserRouter as Router } from "react-router-dom";

function Index() {
    return (
        <Router>
            <Main />
        </Router>
    );
}

if (document.getElementById("root")) {
    const root = ReactDOM.createRoot(document.getElementById("root"));

    root.render(
        <React.StrictMode>
            <Index />
        </React.StrictMode>
    );
}
