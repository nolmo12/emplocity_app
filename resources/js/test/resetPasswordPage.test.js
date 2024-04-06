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
import config from "../config";

var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
var mock = new MockAdapter(axios);
const url = `${config().baseUrl}/api/auth/reset-password`;

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
    test("testing submit click success", async () => {
        const expectedData = {
            password: "12345678",
            repeatPassword: "12345678",
        };

        mock.onPost(url).reply((config) => {
            const requestData = JSON.parse(config.data);
            expect(requestData).toEqual(expectedData);
            return [200, { status: "success" }];
        });
        render(
            <Router>
                <ResetPasswordPage />
            </Router>
        );
        const buttonElement = screen.getByText("Reset");
        await act(async () => {
            fireEvent.click(buttonElement);
        });
        await waitFor(async () => {
            const response = await axios.post(url, {
                password: "12345678",
                repeatPassword: "12345678",
            });
            expect(response.status).toBe(200);
        });
    });
    test("testing submit click fail", async () => {
        const expectedData = {
            password: "123456",
            repeatPassword: "123456",
        };
        mock.onPost(url).reply((config) => {
            const requestData = JSON.parse(config.data);
            expect(requestData).toEqual(expectedData);
            return [401, { status: "fail" }];
        });
        render(
            <Router>
                <ResetPasswordPage />
            </Router>
        );
        const buttonElement = screen.getByText("Reset");
        await act(async () => {
            fireEvent.click(buttonElement);
        });
        await waitFor(async () => {
            try {
                await axios.post(url, {
                    password: "123456",
                    repeatPassword: "123456",
                });
            } catch (error) {
                expect(error.response.status).toBe(401);
            }
        });
    });
});
