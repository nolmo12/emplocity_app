import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import Header from "../components/Header/Header";
import axios from "axios";
import userEvent from "@testing-library/user-event";
const axios = require("axios");
jest.mock("axios");

describe("Header component test", () => {
    test("testing loading resources", () => {
        render(
            <Router>
                <Header />
            </Router>
        );
        const iconPath = screen.getByTestId("loadingIconPath");
        expect(iconPath).toBeInTheDocument();
        const loadingTempLogoPath = screen.getByTestId("loadingTempLogoPath");
        expect(loadingTempLogoPath).toBeInTheDocument();
    });

    test("testing showMenu is ture", async () => {
        const mockedResponse = {
            data: ["ico.png", "tempLogo.png"],
        };
        axios.get.mockResolvedValueOnce(mockedResponse);

        render(
            <Router>
                <Header />
            </Router>
        );
    });
});
