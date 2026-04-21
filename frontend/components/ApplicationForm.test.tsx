import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ApplicationForm from "./ApplicationForm";

describe("ApplicationForm", () => {
  it("shows required field errors on empty submit", async () => {
    const user = userEvent.setup();

    render(<ApplicationForm />);

    await user.click(screen.getByRole("button", { name: "Apply" }));

    expect(screen.getByText("Full name is required")).toBeTruthy();
    expect(screen.getByText("Email is required")).toBeTruthy();
    expect(screen.getByText("Annual income must be greater than 0")).toBeTruthy();
    expect(screen.getByText("Loan amount must be greater than 0")).toBeTruthy();
  });

  it("shows error after blur on empty full name", async () => {
    const user = userEvent.setup();

    render(<ApplicationForm />);

    const input = screen.getByLabelText("Full Name");

    await user.click(input);
    await user.tab();

    expect(screen.getByText("Full name is required")).toBeTruthy();
  });

  it("shows inline email validation error", async () => {
    const user = userEvent.setup();

    render(<ApplicationForm />);

    const emailInput = screen.getByLabelText("Email");

    await user.type(emailInput, "invalid-email");
    await user.tab();

    expect(screen.getByText("Invalid email format")).toBeTruthy();
  });
});