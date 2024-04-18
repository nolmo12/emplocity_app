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

const url = `${config().baseUrl}/api/video/watch/1a7ULotn5s`;
var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");

const mock = new MockAdapter(axios);

jest.mock("../components/useFetchVideo");

describe("UploadPage component test", () => {
    test("video visibility", async () => {
        const expectedData = {
            videoObj: {
                video: {
                    created_at: "2024-04-15T20:45:19.000000Z",
                    id: 5,
                    reference_code: "1a7ULotn5s",
                    thumbnail: "/storage/videos/1a7ULotn5spalic001.jpg",
                    updated_at: "2024-04-15T20:45:19.000000Z",
                    user_id: 1,
                    video: "/storage/videos/1a7ULotn5spalic.mp4",
                    visibility: "Public",
                },
                title: "fsdfsd",
                tags: [
                    {
                        id: 11,
                        name: "fsdfsd",
                        created_at: "2024-04-15T20:45:19.000000Z",
                        updated_at: "2024-04-15T20:45:19.000000Z",
                    },
                ],
                likesCount: 0,
                dislikesCount: 0,
                description: null,
            },
            isLoading: false,
        };
        useFetchVideo.mockReturnValue(expectedData);
        render(
            <MemoryRouter initialEntries={["/video/1a7ULotn5s"]}>
                <VideoFrame />
            </MemoryRouter>
        );
        mock.onGet(url).reply(200, expectedData);
        await waitFor(() =>
            expect(screen.getByTestId("video-player")).toBeInTheDocument()
        );
    });
});
