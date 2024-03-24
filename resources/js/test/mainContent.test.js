import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import MainContent from "../components/MainContent/MainContent";
import axios from "axios";
jest.mock("axios");

describe("MainContent component test", () => {
    test("testing user account content", () => {
        render(
            <Router>
                <MainContent userIsLogged={true} />
            </Router>
        );
        const tableElement = screen.getByTestId("userVideoTable");
        expect(tableElement).toBeInTheDocument();
        const hElement = screen.getByText("Settings");
        expect(hElement).toBeInTheDocument();
        const ulElement = screen.getByTestId("settingsList");
        const liElements = ulElement.getElementsByTagName("li");
        expect(liElements.length).toBe(7);
    });
    test("testing guest account content", () => {
        render(
            <Router>
                <MainContent userIsLogged={false} />
            </Router>
        );
        const hElement = screen.getByText("Popular");
        expect(hElement).toBeInTheDocument();
        const reccomend = screen.getByText("Reccommend");
        expect(reccomend).toBeInTheDocument();
        const ulElement = screen.getByTestId("guestVideoList");
        const liElements = ulElement.getElementsByTagName("li");
        expect(liElements.length).toBe(10);
    });
});
