import React, { useEffect } from "react";
import { useState, useRef } from "react";
import Popular from "../Popular/Popular";
import VideoSection from "../VideoSection/VideoSection";
import VideoFrame from "../VideoFrame/VideoFrame";
import SearchResult from "../SearchResult/SearchResult";
import HelpPage from "../HelpPage/HelpPage";
import Rules from "../Rules/Rules";
import AboutUs from "../AboutUs/AboutUs";
import Settings from "../Settings/Settings";
import Shop from "../Shop/Shop";
import VideoSettings from "../VideoSettings/VideoSettings";
import UserVideoSection from "../UserVideoSection/UserVideoSection";
import authUser from "../authUser";
import config from "../../config";
import styles from "./mainContent.module.css";

export default function MainContent({ contentType }) {
    const [frameIsLoaded, setFrameIsLoaded] = useState(false);
    const mainRef = useRef();
    let view = undefined;

    if (contentType === "guest") {
        view = (
            <main>
                <div id={styles.container}>
                    <Popular />
                    <VideoSection sectionType="reccommend" />
                </div>
            </main>
        );
    } else if (contentType === "logged") {
        view = (
            <main>
                <div id={styles.containerAccount}>
                    <Settings />
                    <UserVideoSection />
                </div>
            </main>
        );
    } else if (contentType === "otherUser") {
        view = (
            <main>
                <div id={styles.container}>
                    <Popular />
                    <VideoSection sectionType="otherAccount" />
                </div>
            </main>
        );
    } else if (contentType === "tag") {
        view = (
            <main>
                <div id={styles.container}>
                    <Popular />
                    <VideoSection sectionType="tag" />
                </div>
            </main>
        );
    } else if (contentType === "result") {
        view = (
            <main>
                <div id={styles.container}>
                    <div id={styles.searchResultPage}>
                        <SearchResult searchType={"userSearch"} />
                    </div>
                </div>
            </main>
        );
    } else if (contentType === "userHistory") {
        view = (
            <main>
                <div id={styles.containerAccount}>
                    <Settings />
                    <SearchResult searchType={"userHistory"} />
                </div>
            </main>
        );
    } else if (contentType === "userLikes") {
        view = (
            <main>
                <div id={styles.containerAccount}>
                    <Settings />
                    <SearchResult searchType={"userLikes"} />
                </div>
            </main>
        );
    } else if (contentType === "userFollows") {
        view = (
            <main>
                <div id={styles.containerAccount}>
                    <Settings />
                    <SearchResult searchType={"userFollows"} />
                </div>
            </main>
        );
    } else if (contentType === "help") {
        view = (
            <main>
                <div id={styles.container}>
                    <HelpPage />
                </div>
            </main>
        );
    } else if (contentType === "video") {
        view = (
            <main ref={mainRef}>
                <div id={styles.container} className={styles.videoFrameMain}>
                    <VideoFrame
                        mainRef={mainRef}
                        setFrameISLoaded={setFrameIsLoaded}
                    />
                    {frameIsLoaded && <VideoSection sectionType="similar" />}
                </div>
            </main>
        );
    } else if (contentType === "shop") {
        view = (
            <main className={styles.shopPage}>
                <Shop />
            </main>
        );
    } else if (contentType === "aboutUs") {
        view = (
            <main>
                <div id={styles.container}>
                    <AboutUs />
                </div>
            </main>
        );
    } else if (contentType === "rules") {
        view = (
            <main>
                <div id={styles.container}>
                    <Rules />
                </div>
            </main>
        );
    } else if (contentType === "videoSettings") {
        view = (
            <main className={styles.videoSettingsPage}>
                <VideoSettings />
            </main>
        );
    }

    return view;
}
