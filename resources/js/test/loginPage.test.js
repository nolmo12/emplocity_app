import React from "react";
import { fireEvent, render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import LoginPage from "../components/LoginPage/LoginPage";
import fetchImage from "../components/fetchImgFromStorage";
import { Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { http } from "../components/authUser";
import Cookies from "js-cookie";

jest.mock("axios");
jest.mock("../components/fetchImgFromStorage");
jest.mock("../components/authUser", () => ({
    __esModule: true,
    default: jest.fn(() => ({
        http: {
            post: jest.fn(),
        },
        setToken: jest.fn(),
        getToken: jest.fn(),
        isLogged: false,
    })),
}));

describe("LoginPage component test", () => {
    test("testing icon visibility", async () => {
        const data = "icon.png";
        fetchImage.mockResolvedValue(data);
        render(
            <Router>
                <LoginPage />
            </Router>
        );
        await screen.findByTestId("icon");
    });
    test("testing email input value", async () => {
        render(
            <Router>
                <LoginPage />
            </Router>
        );
        const emailInput = screen.getByPlaceholderText("Email");
        await act(async () => {
            fireEvent.change(emailInput, {
                target: { value: "example@wp.pl" },
            });
        });
        expect(emailInput).toHaveValue("example@wp.pl");
    });
    test("testing password input value", async () => {
        render(
            <Router>
                <LoginPage />
            </Router>
        );
        const passwordInput = screen.getByPlaceholderText("Password");
        await act(async () => {
            fireEvent.change(passwordInput, {
                target: { value: "password12" },
            });
        });
        expect(passwordInput).toHaveValue("password12");
    });
    test("testing 'Forgot password' visibility", async () => {
        render(
            <Router>
                <LoginPage />
            </Router>
        );
        await act(async () => {
            const forgotPassword = screen.getByText("Forgot password?");
            expect(forgotPassword).toBeInTheDocument();
        });
    });
    test("testing Login button visibility", async () => {
        render(
            <Router>
                <LoginPage />
            </Router>
        );
        await act(async () => {
            const loginButton = screen.getByText("Login");
            expect(loginButton).toBeInTheDocument();
        });
    });
    test("testing 'Create account' visibility", async () => {
        render(
            <Router>
                <LoginPage />
            </Router>
        );
        await act(async () => {
            const createAccount = screen.getByText("Create account");
            expect(createAccount).toBeInTheDocument();
        });
    });
    // test("testing form submit", async () => {
    //     render(
    //         <Router>
    //             <LoginPage />
    //         </Router>
    //     );
    //     const emailInput = screen.getByPlaceholderText("Email");
    //     const passwordInput = screen.getByPlaceholderText("Password");
    //     const form = screen.getByTestId("form");
    //     await act(async () => {
    //         fireEvent.change(emailInput, { target: { value: "exam@gm.com" } });
    //         fireEvent.change(passwordInput, {
    //             target: { value: "password12" },
    //         });
    //     });
    //     expect(fireEvent.submit(form)).toHaveBeenCalledWith("/api/auth/login", {
    //         email: "exam@gm.com",
    //         password: "password12",
    //     }); // poprawa
    // });
});
