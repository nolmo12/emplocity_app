import React from "react";
import {
    screen,
    render,
    fireEvent,
    waitFor,
    act,
} from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import ForgotPasswordPage from "../components/ForgotPasswordPage/ForgotPasswordPage";
import fetchImage from "../components/fetchImgFromStorage";
import axios from "axios";
jest.mock("axios");
jest.mock("../components/fetchImgFromStorage");
jest.mock("axios", () => ({
    create: () => ({
        post: jest.fn(),
    }),
}));
describe("forgotPasswordPage component test", () => {
    test("img icon visibility", async () => {
        const data = "icon.png";
        fetchImage.mockResolvedValue(data);
        render(
            <Router>
                <ForgotPasswordPage />
            </Router>
        );
        await screen.findByTestId("icon");
    });
    test("testing email input render", () => {
        render(
            <Router>
                <ForgotPasswordPage />
            </Router>
        );
        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    });
    test("testing user typing email input", () => {
        render(
            <Router>
                <ForgotPasswordPage />
            </Router>
        );
        const emailInput = screen.getByPlaceholderText("Email");
        fireEvent.change(emailInput, { target: { value: "example@wp.pl" } });
        expect(emailInput.value).toBe("example@wp.pl");
    });
    test("testing send click", async () => {
        render(
            <Router>
                <ForgotPasswordPage />
            </Router>
        );

        const buttonElement = screen.getByText("Send");
        await act(async () => {
            fireEvent.click(buttonElement);
        });
    });
});
