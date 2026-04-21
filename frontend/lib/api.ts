import { FieldErrors, LoanApplication, LoanApplicationInput } from "./types";

type CreateApplicationResponse = {
  id: string;
  status: "pending";
};

type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
    status: number;
    fieldErrors?: FieldErrors;
  };
};

export class ApiError extends Error {
  code: string;
  status: number;
  fieldErrors?: FieldErrors;

  constructor(message: string, code: string, status: number, fieldErrors?: FieldErrors) {
    super(message);
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isFieldErrors = (value: unknown): value is FieldErrors => {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(
    (fieldError) => fieldError === undefined || typeof fieldError === "string"
  );
};

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
  if (!isRecord(value) || !isRecord(value.error)) {
    return false;
  }

  return (
    typeof value.error.code === "string" &&
    typeof value.error.message === "string" &&
    typeof value.error.status === "number" &&
    (value.error.fieldErrors === undefined || isFieldErrors(value.error.fieldErrors))
  );
};

const isCreateApplicationResponse = (value: unknown): value is CreateApplicationResponse => {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.trim().length > 0 &&
    value.status === "pending"
  );
};

const isLoanApplication = (value: unknown): value is LoanApplication => {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.trim().length > 0 &&
    value.status === "pending" &&
    typeof value.fullName === "string" &&
    typeof value.email === "string" &&
    typeof value.annualIncome === "number" &&
    Number.isFinite(value.annualIncome) &&
    typeof value.loanAmount === "number" &&
    Number.isFinite(value.loanAmount)
  );
};

const parseApiError = (value: unknown): ApiError => {
  if (isApiErrorResponse(value)) {
    return new ApiError(
      value.error.message,
      value.error.code,
      value.error.status,
      value.error.fieldErrors
    );
  }

  return new ApiError("Unexpected API response", "INVALID_API_RESPONSE", 500);
};

export const createApplication = async (
  input: LoanApplicationInput
): Promise<CreateApplicationResponse> => {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data: unknown = await response.json();

  if (!response.ok) {
    throw parseApiError(data);
  }

  if (!isCreateApplicationResponse(data)) {
    throw new ApiError("Unexpected API response", "INVALID_API_RESPONSE", 500);
  }

  return data;
};

export const getApplication = async (id: string): Promise<LoanApplication> => {
  const response = await fetch(`${API_BASE_URL}/applications/${id}`);
  const data: unknown = await response.json();

  if (!response.ok) {
    throw parseApiError(data);
  }

  if (!isLoanApplication(data)) {
    throw new ApiError("Unexpected API response", "INVALID_API_RESPONSE", 500);
  }

  return data;
};