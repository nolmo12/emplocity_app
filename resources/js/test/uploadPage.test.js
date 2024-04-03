import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import UploadPage from "../components/UploadPage/UploadPage";
import axios from "axios";
jest.mock("axios");

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
