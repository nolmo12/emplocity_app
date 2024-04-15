import React from "react";
import {
    render,
    screen,
    act,
    fireEvent,
    waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router, MemoryRouter } from "react-router-dom";
import useFetchVideo from "../components/useFetchVideo";
import VideoFrame from "../components/VideoFrame/VideoFrame";
import config from "../config";

const url = `${config().baseUrl}/api/video/watch/N2zxQXpVWo`;
var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
var mock = new MockAdapter(axios);

describe("UploadPage component test", () => {
    test("video visibility", async () => {
        mock.onGet(url).reply(200, {
            videoObj: {
                video: {
                    created_at: "2024-04-11T18:58:14.000000Z",
                    id: 1,
                    reference_code: "N2zxQXpVWo",
                    thumbnail: "/storage/videos/N2zxQXpVWopalic001.jpg",
                    updated_at: "2024-04-11T18:58:14.000000Z",
                    user_id: null,
                    video: "/storage/videos/N2zxQXpVWopalic001.mp4",
                    visibility: "Public",
                },
                title: "gothic",
                tags: [["gothic"]],
                likeCount: 0,
                dislikeCount: 0,
                description: null,
            },
            isLoading: false,
        });
        render(
            <Router>
                <VideoFrame />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByTestId("video-player")).toBeInTheDocument();
        });
    });
});
