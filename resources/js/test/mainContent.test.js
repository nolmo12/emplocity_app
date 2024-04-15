import React from "react";
import { render, screen, act } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import MainContent from "../components/MainContent/MainContent";
jest.mock("axios");

describe("MainContent component test", () => {
    test("testing user account content", async () => {
        render(
            <Router>
                <MainContent contentType="logged" />
            </Router>
        );
        await act(async () => {
            const tableElement = screen.getByTestId("userVideoTable");
            expect(tableElement).toBeInTheDocument();
            const hElement = screen.getByText("Settings");
            expect(hElement).toBeInTheDocument();
            const ulElement = screen.getByTestId("settingsList");
            const liElements = ulElement.getElementsByTagName("li");
            expect(liElements.length).toBe(7);
        });
    });
    test("testing guest account content", async () => {
        render(
            <Router>
                <MainContent contentType="guest" />
            </Router>
        );
        await act(async () => {
            const hElement = screen.getByText("Popular");
            expect(hElement).toBeInTheDocument();
            const ulElement = screen.getByTestId("guestVideoList");
            const liElements = ulElement.getElementsByTagName("li");
            expect(liElements.length).toBe(10);
        });
    });
});
