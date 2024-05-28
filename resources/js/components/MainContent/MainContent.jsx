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
    const mainRef = useRef();
    let view = undefined;

    if (contentType === "guest") {
        view = (
            <main>
                <Popular />
                <VideoSection sectionType="reccommend" />
            </main>
        );
    } else if (contentType === "logged") {
        view = (
            <main>
                <Settings />
                <UserVideoSection />
            </main>
        );
    } else if (contentType === "otherUser") {
        view = (
            <main>
                <Popular />
                <VideoSection sectionType="otherAccount" />
            </main>
        );
    } else if (contentType === "tag") {
        view = (
            <main>
                <Popular />
                <VideoSection sectionType="tag" />
            </main>
        );
    } else if (contentType === "result") {
        view = (
            <main>
                <Popular />
                <SearchResult searchType={"userSearch"} />
            </main>
        );
    } else if (contentType === "userHistory") {
        view = (
            <main>
                <Popular />
                <SearchResult searchType={"userHistory"} />
            </main>
        );
    } else if (contentType === "userLikes") {
        view = (
            <main>
                <Popular />
                <SearchResult searchType={"userLikes"} />
            </main>
        );
    } else if (contentType === "help") {
        view = (
            <main>
                <HelpPage />
            </main>
        );
    } else if (contentType === "video") {
        view = (
            <main className={styles.videoFrameMain} ref={mainRef}>
                <VideoFrame mainRef={mainRef} />
                <VideoSection sectionType="similar" />
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
                <AboutUs />
            </main>
        );
    } else if (contentType === "rules") {
        view = (
            <main>
                <Rules />
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
