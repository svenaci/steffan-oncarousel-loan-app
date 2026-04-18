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

describe("GET /applications/:id", () => {
  const validPayload = {
    fullName: "John Doe",
    email: "john@example.com",
    annualIncome: 100000,
    loanAmount: 300000,
  };

  beforeEach(() => {
    clearApplications();
  });

  it("returns an existing application", async () => {
    const createResponse = await request(app).post("/applications").send(validPayload);

    const response = await request(app).get(`/applications/${createResponse.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createResponse.body.id);
    expect(response.body.status).toBe("pending");
    expect(response.body.fullName).toBe(validPayload.fullName);
    expect(response.body.email).toBe(validPayload.email);
    expect(response.body.annualIncome).toBe(validPayload.annualIncome);
    expect(response.body.loanAmount).toBe(validPayload.loanAmount);
  });

  it("returns 404 for an unknown application id", async () => {
    const response = await request(app).get("/applications/unknownID");

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("APPLICATION_NOT_FOUND");
    expect(response.body.error.message).toBe("Application not found");
    expect(response.body.error.status).toBe(404);
  });
});
