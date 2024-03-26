import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import Popular from "../components/Popular/Popular";
describe("Popular component test", () => {
    test("testing Popular-text render", () => {
        render(
            <Router>
                <Popular />
            </Router>
        );
        const h1Element = screen.getByText("Popular");
        expect(h1Element).toBeInTheDocument();
    });
    test("testing <ul> render", () => {
        render(
            <Router>
                <Popular />
            </Router>
        );
        const ulElements = screen.getAllByRole("listitem");
        expect(ulElements.length).toBe(10);
    });
});
