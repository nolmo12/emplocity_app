import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import Popular from "../components/Popular/Popular";
describe("Popular component test", () => {
    test("Popular-text render", () => {
        render(
            <Router>
                <Popular />
            </Router>
        );
        const h1Element = screen.getByText("Popular");
        expect(h1Element).toBeInTheDocument();
    });
    test("<ul> element render", () => {
        render(
            <Router>
                <Popular />
            </Router>
        );
        const ulElement = screen.getByTestId("guestVideoList");
        const liElements = ulElement.getElementsByTagName("li");
        expect(liElements.length).toBe(10);
    });
});
