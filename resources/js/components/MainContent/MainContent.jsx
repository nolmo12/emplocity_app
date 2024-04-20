import React from "react";
import { useState } from "react";
import Popular from "../Popular/Popular";
import VideoSection from "../VideoSection/VideoSection";
import VideoFrame from "../VideoFrame/VideoFrame";
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
            <main>
                <VideoFrame />
                <VideoSection sectionType="similar" />
            </main>
        );
    }

    return view;
}