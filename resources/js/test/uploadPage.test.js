import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import UploadPage from "../components/UploadPage/UploadPage";
import config from "../config";

class DataTransfer {
    constructor() {
        this.items = [];
    }
}

global.DataTransfer = DataTransfer;

const url = `${config().baseUrl}/api/video/upload`;
var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
var mock = new MockAdapter(axios);

describe("UploadPage component test", () => {
    test("form should send video info", async () => {
        render(
            <Router>
                <UploadPage />
            </Router>
        );
        await act(async () => {
            const videoElement = screen.getByTestId("upload-area");
            const titleElement = screen.getByPlaceholderText("Title");
            const tagsElement = screen.getByPlaceholderText("Tags");
            const descriptionElement =
                screen.getByPlaceholderText("Description");
            const languageElement = screen.getByTestId("language-select");
            const thumbnailElement = screen.getByTestId("thumbnail-input");
            const visibilityElement = screen.getByTestId("visibility-select");
            const submitElement = screen.getByText("Submit");

            const video = new File([""], "video.mp4", {
                type: "video/mp4",
            });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.push(video);

            fireEvent.change(videoElement, {
                target: { video: dataTransfer.video },
            });
            fireEvent.change(titleElement, {
                target: { value: "Gothic" },
            });
            fireEvent.change(tagsElement, {
                target: { value: "game, rpg" },
            });
            fireEvent.change(descriptionElement, {
                target: { value: "Gothic is a classic RPG game" },
            });
            fireEvent.change(languageElement, {
                target: { value: 1 },
            });

            const file = new File(["thumbnail.png"], "thumbnail.png", {
                type: "image/png",
            });
            dataTransfer.items.push(file);

            fireEvent.change(thumbnailElement, {
                target: { files: dataTransfer.files },
            });
            fireEvent.change(visibilityElement, {
                target: { value: "Public" },
            });

            const requestFormData = new FormData();
            requestFormData.append("video", video);
            requestFormData.append("title", "Gothic");
            requestFormData.append("tags", "game, rpg");
            requestFormData.append(
                "description",
                "Gothic is a classic RPG game"
            );
            requestFormData.append("language", 1);
            requestFormData.append("thumbnail", file);
            requestFormData.append("visibility", "Public");

            const expectedData = {
                video: requestFormData.get("video"),
                title: requestFormData.get("title"),
                tags: requestFormData.get("tags"),
                description: requestFormData.get("description"),
                language: parseInt(requestFormData.get("language")),
                thumbnail: requestFormData.get("thumbnail"),
                visibility: requestFormData.get("visibility"),
            };

            mock.onPost(url).reply((config) => {
                const requestData = config.data;
                const formData = new FormData();
                Object.entries(requestData).forEach(([key, value]) => {
                    formData.append(key, value);
                });
                const video = requestData.get("video");
                const thumbnail = requestData.get("thumbnail");
                const title = requestData.get("title");
                const tags = requestData.get("tags");
                const description = requestData.get("description");
                const language = requestData.get("language");
                const visibility = requestData.get("visibility");

                expect(video.name).toBe("video.mp4");
                expect(thumbnail.name).toBe("thumbnail.png");
                expect(title).toBe("Gothic");
                expect(tags).toBe("game, rpg");
                expect(description).toBe("Gothic is a classic RPG game");
                expect(language).toBe("1");
                expect(visibility).toBe("Public");
                return [200, { status: "success" }];
            });

            fireEvent.click(submitElement);
            const formData = new FormData();
            formData.append("video", video);
            formData.append("title", "Gothic");
            formData.append("tags", "game, rpg");
            formData.append("description", "Gothic is a classic RPG game");
            formData.append("language", 1);
            formData.append("thumbnail", file);
            formData.append("visibility", "Public");

            const response = await axios.post(url, formData);

            expect(response.status).toBe(200);
        });
    });
});
