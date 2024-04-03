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
import ResetPasswordPage from "../components/ResetPasswordPage/ResetPasswordPage";
import axios from "axios";
jest.mock("axios");
jest.mock("../components/fetchImgFromStorage");
jest.mock("axios", () => ({
    create: () => ({
        post: jest.fn(),
    }),
}));

describe("resetPasswordPage component test", () => {
    test("testing `Enter your new password` rendering", () => {
        render(
            <Router>
                <ResetPasswordPage />
            </Router>
        );
        expect(screen.getByText("Enter your new password")).toBeInTheDocument();
    });
    test("testing user typing password input", () => {
        render(
            <Router>
                <ResetPasswordPage />
            </Router>
        );
        const passwordInput = screen.getByPlaceholderText("Password");
        fireEvent.change(passwordInput, { target: { value: "password" } });
        expect(passwordInput.value).toBe("password");
    });
    test("testing user typing repeat password input", () => {
        render(
            <Router>
                <ResetPasswordPage />
            </Router>
        );
        const repeatPasswordInput =
            screen.getByPlaceholderText("Repeat password");
        fireEvent.change(repeatPasswordInput, {
            target: { value: "password" },
        });
        expect(repeatPasswordInput.value).toBe("password");
    });
    // test("testing submit click", async () => {
    //     render(
    //         <Router>
    //             <ResetPasswordPage />
    //         </Router>
    //     );
    //     const buttonElement = screen.getByText("Reset");
    //     await act(async () => {
    //         fireEvent.click(buttonElement);
    //     });
    // });
});
