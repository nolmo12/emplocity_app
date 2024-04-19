import React from "react";
import {
    render,
    screen,
    act,
    fireEvent,
    waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import useFetchVideo from "../components/useFetchVideo";
import useLike from "../components/useLike";
import VideoFrame from "../components/VideoFrame/VideoFrame";
import config from "../config";
import { expectedDataVideoFrame } from "./exampleDataForSingle";
const url = `${config().baseUrl}/api/video/watch/1a7ULotn5s`;
var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");

const mock = new MockAdapter(axios);
jest.mock("../components/useLike", () => ({
    __esModule: true,
    default: () => ({
        fetchLikes: jest.fn(),
        sendLikes: jest.fn(),
    }),
}));
const videoObj = expectedDataVideoFrame.videoObj;
jest.mock("../components/useFetchVideo");

describe("VideoFrame component test", () => {
    beforeEach(() => {
        useFetchVideo.mockReturnValue(expectedDataVideoFrame);
        render(
            <Router>
                <VideoFrame />
            </Router>
        );
        mock.onGet(url).reply(200, expectedDataVideoFrame);
    });

    test("video player visibility", async () => {
        const videoElement = await screen.findByTestId("video-player");
        expect(videoElement).toBeInTheDocument();
    });

    test("like button is in the document", async () => {
        const likeElement = await screen.findByTestId("like-button");
        expect(likeElement).toBeInTheDocument();
    });

    test("dislike button is in the document", async () => {
        const dislikeElement = await screen.findByTestId("dislike-button");
        expect(dislikeElement).toBeInTheDocument();
    });

    test("video owner paragraph has correct name", async () => {
        const videoOwnerElement = await screen.findByTestId("video-owner");
        expect(videoOwnerElement).toHaveTextContent(videoObj.userName);
    });

    test("video title paragraph has correct title", async () => {
        const videoTitleElement = await screen.findByTestId("video-title");
        expect(videoTitleElement).toHaveTextContent(videoObj.title);
    });

    test("video description paragraph has correct description", async () => {
        const videoDescriptionElement = await screen.findByTestId(
            "video-description"
        );
        expect(videoDescriptionElement).toHaveTextContent(videoObj.description);
    });
});
