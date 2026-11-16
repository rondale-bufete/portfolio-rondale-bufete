import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContributionYearFilter from "./ContributionYearFilter";

afterEach(() => {
    vi.restoreAllMocks();
});

describe("ContributionYearFilter", () => {
    it("submits immediately after a year is selected and preserves the traffic range", async () => {
        const requestSubmit = vi.spyOn(HTMLFormElement.prototype, "requestSubmit").mockImplementation(() => {});
        const user = userEvent.setup();

        render(<ContributionYearFilter years={[2025, 2024]} selectedYear={2025} range={30} />);

        await user.selectOptions(screen.getByRole("combobox", { name: "Year" }), "2024");

        expect(requestSubmit).toHaveBeenCalledOnce();
        const form = screen.getByRole("combobox", { name: "Year" }).closest("form");
        expect(form).toHaveAttribute("action", "/admin");
        expect(form.elements.namedItem("range")).toHaveValue("30");
    });
});
