import { describe, it, expect } from "vitest";
import { validateLoanApplication } from "./validation";

describe("validateLoanApplication", () => {
  const baseInput = {
    fullName: "John Doe",
    email: "john@example.com",
    annualIncome: 100000,
    loanAmount: 300000,
  };

  it("passes for valid input", () => {
    expect(validateLoanApplication(baseInput)).toEqual({});
  });

  it("fails when full name is blank", () => {
    const result = validateLoanApplication({
      ...baseInput,
      fullName: "   ",
    });

    expect(result.fullName).toBe("Full name is required");
  });

  it("fails when email is invalid", () => {
    const result = validateLoanApplication({
      ...baseInput,
      email: "invalid-email",
    });

    expect(result.email).toBe("Invalid email format");
  });

  it("fails when income is zero", () => {
    const result = validateLoanApplication({
      ...baseInput,
      annualIncome: 0,
    });

    expect(result.annualIncome).toBe("Annual income must be greater than 0");
  });

  it("fails when loan amount is negative", () => {
    const result = validateLoanApplication({
      ...baseInput,
      loanAmount: -100,
    });

    expect(result.loanAmount).toBe("Loan amount must be greater than 0");
  });

  it("passes when loan amount is exactly 5x income", () => {
    const result = validateLoanApplication({
      ...baseInput,
      annualIncome: 100000,
      loanAmount: 500000,
    });

    expect(result.loanAmount).toBeUndefined();
  });

  it("fails when loan amount exceeds 5x income by 1", () => {
    const result = validateLoanApplication({
      ...baseInput,
      annualIncome: 100000,
      loanAmount: 500001,
    });

    expect(result.loanAmount).toBe("Loan amount cannot exceed 5× annual income");
  });

  it("does not run business rules if base validation fails", () => {
    const result = validateLoanApplication({
      ...baseInput,
      annualIncome: 0,
      loanAmount: 9999999,
    });

    expect(result.annualIncome).toBeDefined();
    expect(result.loanAmount).not.toBe("Loan amount cannot exceed 5× annual income");
  });

  it("fails when text fields are not valid strings", () => {
    const result = validateLoanApplication({
      ...baseInput,
      fullName: undefined,
      email: null,
    } as any);

    expect(result.fullName).toBe("Full name must be a valid string");
    expect(result.email).toBe("Email must be a valid string");
  });
});