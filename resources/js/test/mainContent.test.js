import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import MainContent from "../components/MainContent/MainContent";
describe("MainContent component test", () => {
    test("testing <main> render", () => {
        render(
            <Router>
                <MainContent />
            </Router>
        );
        const mainElement = screen.getByRole("main");
        expect(mainElement).toBeInTheDocument();
    });
});
