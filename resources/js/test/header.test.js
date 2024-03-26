import React from "react";
import { fireEvent, render, screen, act } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import Header from "../components/Header/Header";
import fetchImage from "../components/fetchImgFromStorage";
jest.mock("../components/fetchImgFromStorage");
const fixActAwaitWarning = () => {
    beforeAll(() => {
        global.Promise = global.nativePromise;
    });
    afterAll(() => {
        global.Promise = global.polyfilledPromise;
    });
};
describe("HeaderPage component test", () => {
    test("testing loading resources", async () => {
        render(
            <Router>
                <Header />
            </Router>
        );
        await act(async () => {
            const iconPath = screen.getByTestId("loadingIconPath");
            expect(iconPath).toBeInTheDocument();
            const loadingTempLogoPath = screen.getByTestId(
                "loadingTempLogoPath"
            );
            expect(loadingTempLogoPath).toBeInTheDocument();
        });
    });

    test("testing showMenu visibility", async () => {
        const data = "icon.png";
        fetchImage.mockResolvedValue(data);
        render(
            <Router>
                <Header />
            </Router>
        );

        await screen.findByTestId("icon");
        const iconElement = screen.getByTestId("icon");
        expect(screen.queryByRole("ul")).not.toBeInTheDocument();
        fireEvent.click(iconElement);
        await screen.findByTestId("ulMenu");
        const ulElement = screen.getByTestId("ulMenu");
        expect(ulElement).toBeInTheDocument();
    });

    test("testing render icon and logo", async () => {
        const data = "icon.png";
        fetchImage.mockResolvedValue(data);
        render(
            <Router>
                <Header />
            </Router>
        );

        await screen.findByTestId("icon");
        const iconElement = screen.getByTestId("icon");
        expect(iconElement).toBeInTheDocument();
        await screen.findByTestId("tempLogo");
        const tempLogoElement = screen.getByTestId("tempLogo");
        expect(tempLogoElement).toBeInTheDocument();
    });
});
