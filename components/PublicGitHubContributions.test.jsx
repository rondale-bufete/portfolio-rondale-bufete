import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PublicGitHubContributions from "./PublicGitHubContributions";

afterEach(() => {
    vi.unstubAllGlobals();
});

const initialData = {
    available: true,
    username: "example",
    year: 2025,
    availableYears: [2025, 2024],
    totalContributions: 42,
    weeks: [],
};

describe("PublicGitHubContributions", () => {
    it("loads and displays the selected year", async () => {
        const user = userEvent.setup();
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ ...initialData, year: 2024, totalContributions: 18 }),
        });
        vi.stubGlobal("fetch", fetchMock);
        render(<PublicGitHubContributions initialData={initialData} title="Open-source activity" />);

        await user.selectOptions(screen.getByRole("combobox", { name: "Contribution year" }), "2024");

        expect(fetchMock).toHaveBeenCalledWith("/api/github-contributions?year=2024", {
            headers: { Accept: "application/json" },
        });
        expect(await screen.findByText(/contributions in 2024/i)).toBeInTheDocument();
        expect(screen.getByText("18")).toBeInTheDocument();
    });

    it("keeps the existing year and reports a load error", async () => {
        const user = userEvent.setup();
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: false,
                json: async () => ({ message: "GitHub is unavailable." }),
            })
        );
        render(<PublicGitHubContributions initialData={initialData} title="Open-source activity" />);

        await user.selectOptions(screen.getByRole("combobox", { name: "Contribution year" }), "2024");

        expect(await screen.findByRole("status")).toHaveTextContent("GitHub is unavailable.");
        expect(screen.getByRole("combobox", { name: "Contribution year" })).toHaveValue("2025");
        expect(screen.getByText(/contributions in 2025/i)).toBeInTheDocument();
    });
});
