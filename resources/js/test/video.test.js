import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import useFetchVideo from "../components/useFetchVideo";
import useLike from "../components/useLike";
import useLikeCalculation from "../components/useLikeCalculation";
import Video from "../components/Video/Video";
import { expectedDataVideo } from "./exampleDataForSingle";
import config from "../config";

var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
const videoObj = expectedDataVideo;
const mock = new MockAdapter(axios);

jest.mock("../components/useLike", () => ({
    __esModule: true,
    default: () => ({
        fetchLikes: jest.fn(),
        sendLikes: jest.fn(),
    }),
}));

const mockCalculateLikeRatio = jest.fn();

jest.mock("../components/useLikeCalculation", () => ({
    __esModule: true,
    default: () => ({
        likeCountFunction: jest.fn(),
        calculateLikeRatio: mockCalculateLikeRatio,
    }),
}));

describe("Video component test", () => {
    beforeEach(() => {
        render(
            <Router>
                <Video videoObj={expectedDataVideo} />
            </Router>
        );
    });

    test("video title paragraph has correct title", async () => {
        const videoTitleElement = await screen.findByTestId("video-title");
        expect(videoTitleElement).toHaveTextContent(
            videoObj.languages[0].pivot.title
        );
    });

    test("video owner paragraph has correct owner", async () => {
        const videoOwnerElement = await screen.findByTestId("video-owner");
        expect(videoOwnerElement).toHaveTextContent(videoObj.userName);
    });

    test("video views paragraph has correct views", async () => {
        const videoViewsElement = await screen.findByTestId("video-views");
        expect(videoViewsElement).toHaveTextContent(videoObj.views);
    });

    test("video date paragraph has correct date", async () => {
        const videoDateElement = await screen.findByTestId("video-date");
        expect(videoDateElement).toHaveTextContent(
            videoObj.created_at.substring(0, 10)
        );
    });

    test("video like ratio paragraph has correct ratio", async () => {
        const videoLikeRatioElement = await screen.findByTestId(
            "video-like-ratio"
        );
        expect(videoLikeRatioElement).toBeInTheDocument();
        expect(mockCalculateLikeRatio).toHaveBeenCalled();
    });
});
