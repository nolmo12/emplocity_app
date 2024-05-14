import React from "react";
import { useState } from "react";
import Popular from "../Popular/Popular";
import VideoSection from "../VideoSection/VideoSection";
import VideoFrame from "../VideoFrame/VideoFrame";
import SearchResult from "../SearchResult/SearchResult";
import HelpPage from "../HelpPage/HelpPage";
import Rules from "../Rules/Rules";
import AboutUs from "../AboutUs/AboutUs";
import Settings from "../Settings/Settings";
import Shop from "../Shop/Shop";
import UserVideoSection from "../UserVideoSection/UserVideoSection";
import styles from "./mainContent.module.css";
import _ from "lodash";

export default function MainContent({ contentType }) {
    const handleScroll = _.throttle((e) => {
        const element = e.target;
        const scrollHeight = element.scrollHeight;
        const scrollTop = element.scrollTop;
        const clientHeight = element.clientHeight;
    
        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    
        if (scrollPercentage >= 0.8) {
            console.log("80% scroll event");
        }
    }, 300);
    
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
            <main className={styles.videoFrameMain}  onScroll={handleScroll}>
                <VideoFrame />
                <VideoSection sectionType="similar" />
            </main>
        );
    } else if (contentType === "shop") {
        view = (
            <main className={styles.videoFrameMain}>
                <Shop />
            </main>
        );
    } else if (contentType === "aboutUs") {
        view = (
            <main>
                <Popular />
                <AboutUs />
            </main>
        );
    } else if (contentType === "rules") {
        view = (
            <main>
                <Popular />
                <Rules />
            </main>
        );
    }

    return view;
}
