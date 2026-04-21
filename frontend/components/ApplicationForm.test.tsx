import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ApplicationForm from "./ApplicationForm";

describe("ApplicationForm", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

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

  it("shows loading state while submitting", async () => {
    const user = userEvent.setup();

    const fetchMock = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ id: "app-123", status: "pending" }),
                }),
              0
            )
          )
      )
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "app-123",
          status: "pending",
          fullName: "Jane Smith",
          email: "jane@example.com",
          annualIncome: 100000,
          loanAmount: 300000,
        }),
      });

    global.fetch = fetchMock as any;

    render(<ApplicationForm />);

    await user.type(screen.getByLabelText("Full Name"), "Jane Smith");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Annual Income"), "100000");
    await user.type(screen.getByLabelText("Loan Amount"), "300000");
    await user.click(screen.getByRole("button", { name: "Apply" }));

    expect(screen.getByRole("button", { name: "Submitting..." })).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText("Pending Review")).toBeTruthy();
    });
  });

  it("shows persisted success summary after submit", async () => {
    const user = userEvent.setup();

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "app-123", status: "pending" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "app-123",
          status: "pending",
          fullName: "Jane Smith",
          email: "jane@example.com",
          annualIncome: 100000,
          loanAmount: 300000,
        }),
      });

    global.fetch = fetchMock as any;

    render(<ApplicationForm />);

    await user.type(screen.getByLabelText("Full Name"), "Jane Smith");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Annual Income"), "100000");
    await user.type(screen.getByLabelText("Loan Amount"), "300000");
    await user.click(screen.getByRole("button", { name: "Apply" }));

    await waitFor(() => {
      expect(screen.getByText("Pending Review")).toBeTruthy();
    });

    expect(screen.getByText("Jane Smith")).toBeTruthy();
    expect(screen.getByText("jane@example.com")).toBeTruthy();
    expect(screen.getByText("100000")).toBeTruthy();
    expect(screen.getByText("300000")).toBeTruthy();
  });

  it("maps backend field errors to the form UI", async () => {
    const user = userEvent.setup();

    const fetchMock = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid application input",
          status: 400,
          fieldErrors: {
            email: "Invalid email format",
          },
        },
      }),
    });

    global.fetch = fetchMock as any;

    render(<ApplicationForm />);

    await user.type(screen.getByLabelText("Full Name"), "Jane Smith");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Annual Income"), "100000");
    await user.type(screen.getByLabelText("Loan Amount"), "300000");
    await user.click(screen.getByRole("button", { name: "Apply" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email format")).toBeTruthy();
    });
  });

  it("shows a top-level error for an invalid success response", async () => {
    const user = userEvent.setup();

    const fetchMock = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => null,
    });

    global.fetch = fetchMock as any;

    render(<ApplicationForm />);

    await user.type(screen.getByLabelText("Full Name"), "Jane Smith");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Annual Income"), "100000");
    await user.type(screen.getByLabelText("Loan Amount"), "300000");
    await user.click(screen.getByRole("button", { name: "Apply" }));

    await waitFor(() => {
      expect(screen.getByText("Unexpected API response")).toBeTruthy();
    });
  });
});