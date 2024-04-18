import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import VideoSection from "../components/VideoSection/VideoSection";
import useFetchAllVideos from "../components/useFetchAllVideos";
import { expectedData } from "./exampleData.js";
import config from "../config";

const url = `${config().baseUrl}/api/video/all`;
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

jest.mock("../components/useFetchAllVideos");
describe("VideoSection component test", () => {
    beforeEach(() => {
        useFetchAllVideos.mockReturnValue(expectedData);
        render(
            <Router>
                <VideoSection sectionType="reccommend" />
            </Router>
        );
        mock.onGet(url).reply(200, expectedData);
    });

    test("VideoSection sectionType='reccommend' loaded", async () => {
        expect(screen.getByText("Reccommend")).toBeInTheDocument();
    });

    // test("Render right amount of videos", async () => {
    //     render(<VideoSection sectionType="reccommend" />); // replace with your actual props

    //     const videoElements = await screen.findAllByTestId(/video-/);
    //     expect(videoElements.length).toBe(expectedData.length);
    // });
});
