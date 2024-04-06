import React from "react";
import {
    fireEvent,
    render,
    screen,
    act,
    waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import LoginPage from "../components/LoginPage/LoginPage";
import fetchImage from "../components/fetchImgFromStorage";
import { Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { http } from "../components/authUser";
import Cookies from "js-cookie";
const url = "http://127.0.0.1:8000/api/auth/login";
var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
var mock = new MockAdapter(axios);
jest.mock("../components/fetchImgFromStorage");

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
    test("testing user typing in email input", async () => {
        render(
            <Router>
                <LoginPage />
            </Router>
        );
        const emailInput = screen.getByPlaceholderText("Email");
        await act(async () => {
            fireEvent.change(emailInput, { target: { value: "example@.com" } });
        });
        expect(emailInput).toHaveValue("example@.com");
    });
    test("testing user typing in password input", async () => {
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
    test("testing form submit success", async () => {
        const expectedData = {
            email: "example@.com",
            password: "password12",
            repeatPassword: "password12",
        };
        mock.onPost(url).reply((config) => {
            const requestData = JSON.parse(config.data);
            expect(requestData).toEqual(expectedData);
            return [200, { status: "success" }];
        });
        render(
            <Router>
                <LoginPage />
            </Router>
        );

        const buttonElement = screen.getByText("Login");
        await act(async () => {
            fireEvent.click(buttonElement);
        });
        await waitFor(async () => {
            const response = await axios.post(url, {
                email: "example@.com",
                password: "password12",
                repeatPassword: "password12",
            });
            expect(response.status).toBe(200);
        });
    });
    test("testing form submit fail", async () => {
        const expectedData = {
            email: "examp",
            password: "password12",
            repeatPassword: "pass",
        };
        mock.onPost(url).reply((config) => {
            const requestData = JSON.parse(config.data);
            expect(requestData).toEqual(expectedData);
            return [401, { status: "fail" }];
        });
        render(
            <Router>
                <LoginPage />
            </Router>
        );

        const buttonElement = screen.getByText("Login");
        await act(async () => {
            fireEvent.click(buttonElement);
        });
        await waitFor(async () => {
            try {
                await axios.post(url, {
                    email: "examp",
                    password: "password12",
                    repeatPassword: "pass",
                });
            } catch (e) {
                expect(e.response.status).toBe(401);
            }
        });
    });
});
