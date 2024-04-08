import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import UploadPage from "../components/UploadPage/UploadPage";

const url = `${config().baseUrl}/api/video/upload`;
var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
var mock = new MockAdapter(axios);

describe("UploadPage component test", () => {
    test("form without input should be rendered", async () => {
        render(
            <Router>
                <UploadPage />
            </Router>
        );
        await act(async () => {
            const formElement = screen.getByTestId("uploadFormWithoutInput");
            expect(formElement).toBeInTheDocument();
        });
    });
});
