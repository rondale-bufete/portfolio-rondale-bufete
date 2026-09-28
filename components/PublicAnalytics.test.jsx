import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

let mockPathname = "/";
vi.mock("next/navigation", () => ({
    usePathname: () => mockPathname,
}));

vi.mock("@vercel/analytics/next", () => ({
    Analytics: () => <div data-testid="analytics" />,
}));
vi.mock("@vercel/speed-insights/next", () => ({
    SpeedInsights: () => <div data-testid="speed-insights" />,
}));

const { default: PublicAnalytics } = await import("./PublicAnalytics");

describe("PublicAnalytics", () => {
    it("renders Analytics and SpeedInsights on a public route", () => {
        mockPathname = "/";
        const { getByTestId } = render(<PublicAnalytics />);
        expect(getByTestId("analytics")).toBeInTheDocument();
        expect(getByTestId("speed-insights")).toBeInTheDocument();
    });

    it("renders nothing on an admin route, so admin visits aren't counted as traffic", () => {
        mockPathname = "/admin/projects";
        const { queryByTestId, container } = render(<PublicAnalytics />);
        expect(queryByTestId("analytics")).not.toBeInTheDocument();
        expect(queryByTestId("speed-insights")).not.toBeInTheDocument();
        expect(container).toBeEmptyDOMElement();
    });

    it("renders nothing on the admin root itself", () => {
        mockPathname = "/admin";
        const { container } = render(<PublicAnalytics />);
        expect(container).toBeEmptyDOMElement();
    });
});
