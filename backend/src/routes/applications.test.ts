import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../server";
import { clearApplications } from "../store";

describe("POST /applications", () => {
  const validPayload = {
    fullName: "John Doe",
    email: "john@example.com",
    annualIncome: 100000,
    loanAmount: 300000,
  };

  beforeEach(() => {
    clearApplications();
  });

  it("returns 201 with id and pending status for valid input", async () => {
    const response = await request(app).post("/applications").send(validPayload);

    expect(response.status).toBe(201);
    expect(typeof response.body.id).toBe("string");
    expect(response.body.status).toBe("pending");
  });

  it("returns 400 for invalid input", async () => {
    const response = await request(app).post("/applications").send({
      ...validPayload,
      email: "invalid-email",
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.message).toBe("Invalid application input");
    expect(response.body.error.status).toBe(400);
  });

  it("returns field-level validation errors", async () => {
    const response = await request(app).post("/applications").send({
      ...validPayload,
      fullName: "",
      email: "bad-email",
    });

    expect(response.status).toBe(400);
    expect(response.body.error.fieldErrors.fullName).toBe("Full name is required");
    expect(response.body.error.fieldErrors.email).toBe("Invalid email format");
  });

  it("enforces the loan amount upper bound rule", async () => {
    const response = await request(app).post("/applications").send({
      ...validPayload,
      annualIncome: 100000,
      loanAmount: 500001,
    });

    expect(response.status).toBe(400);
    expect(response.body.error.fieldErrors.loanAmount).toBe(
      "Loan amount cannot exceed 5× annual income"
    );
  });

  it("accepts a loan amount exactly equal to 5x income", async () => {
    const response = await request(app).post("/applications").send({
      ...validPayload,
      annualIncome: 100000,
      loanAmount: 500000,
    });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("pending");
  });
});