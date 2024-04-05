import React from "react";
import Popular from "../Popular/Popular";
import VideoSection from "../VideoSection/VideoSection";
import SearchResult from "../SearchResult/SearchResult";
import HelpPage from "../HelpPage/HelpPage";
import Settings from "../Settings/Settings";
import UserVideoSection from "../UserVideoSection/UserVideoSection";
import styles from "./mainContent.module.css";

export default function MainContent({ contentType }) {
    let view = undefined;
    if (contentType === "guest") {
        view = (
            <main>
                <Popular />
                <VideoSection />
            </main>
        );
    } else if (contentType === "logged") {
        view = (
            <main>
                <Settings />
                <UserVideoSection />
            </main>
        );
    } else if (contentType === "result") {
        view = (
            <main>
                <Popular />
                <SearchResult />
            </main>
        );
    } else if (contentType === "help") {
        view = (
            <main>
                <HelpPage />
            </main>
        );
    }

    return view;
}
