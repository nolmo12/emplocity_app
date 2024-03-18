import React from "react";
import Popular from "../Popular/Popular";
import VideoSection from "../VideoSection/VideoSection";
import styles from "./mainContent.module.css";
import Settings from "../Settings/Settings";
import UserVideoSection from "../UserVideoSection/UserVideoSection";
export default function MainContent({ userIsLogged }) {
    const view = userIsLogged ? (
        <main>
            <Settings />
            <UserVideoSection />
        </main>
    ) : (
        <main>
            <Popular />
            <VideoSection />
        </main>
    );
    return view;
}
