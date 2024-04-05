import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import RegisterPage from "../components/RegisterPage/RegisterPage";
import fetchImage from "../components/fetchImgFromStorage";
import authUser from "../components/authUser";
const url = "http://127.0.0.1:8000/api/auth/register";
var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
var mock = new MockAdapter(axios);
mock.onPost("/api/auth/register").reply(200);

describe("Register component test", () => {
    test("email input changes when user types", async () => {
        render(
            <Router>
                <RegisterPage />
            </Router>
        );
        const inputElement = screen.getByPlaceholderText("Email");
        await act(async () => {
            fireEvent.change(inputElement, {
                target: { value: "example@.com" },
            });
            expect(inputElement.value).toBe("example@.com");
        });
    });
    test("password input changes when user types", async () => {
        render(
            <Router>
                <RegisterPage />
            </Router>
        );
        const inputElement = screen.getByPlaceholderText("Password");
        await act(async () => {
            fireEvent.change(inputElement, { target: { value: "123456" } });
        });
        expect(inputElement.value).toBe("123456");
    });
    test("repeat password input changes when user types", async () => {
        render(
            <Router>
                <RegisterPage />
            </Router>
        );
        const inputElement = screen.getByPlaceholderText("Repeat password");
        await act(async () => {
            fireEvent.change(inputElement, { target: { value: "123456" } });
            expect(inputElement.value).toBe("123456");
        });
    });
    test("send form data with correct inputs", async () => {
        const expectedData = {
            email: "example@.com",
            password: "123456",
            repeatPassword: "123456",
        };

        mock.onPost(url).reply((config) => {
            const requestData = JSON.parse(config.data);
            expect(requestData).toEqual(expectedData);

            return [
                200,
                {
                    status: "success",
                },
            ];
        });
        render(
            <Router>
                <RegisterPage />
            </Router>
        );

        const response = await axios.post(url, {
            email: "example@.com",
            password: "123456",
            repeatPassword: "123456",
        });
        expect(response.status).toBe(200);
    });
    test("send form data with incorrect inputs", async () => {
        const expectedData = {
            email: "exam.com",
            password: "123456",
            repeatPassword: "12345",
        };

        mock.onPost(url).reply((config) => {
            const requestData = JSON.parse(config.data);
            expect(requestData).toEqual(expectedData);

            return [
                401,
                {
                    status: "fail",
                },
            ];
        });

        render(
            <Router>
                <RegisterPage />
            </Router>
        );
        try {
            await axios.post(url, {
                email: "exam.com",
                password: "123456",
                repeatPassword: "12345",
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }
    });
    test("testing 'I already have an account' visibility", async () => {
        render(
            <Router>
                <RegisterPage />
            </Router>
        );
        const linkElement = screen.getByText("I already have an account");
        expect(linkElement).toBeInTheDocument();
    });
});
