import { FieldErrors, LoanApplicationInput } from "./types";

const MAX_LOAN_INCOME_MULTIPLIER = 5;

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateBasicLoanApplicationFields = (input: LoanApplicationInput): FieldErrors => {
  const errors: FieldErrors = {};
  const { fullName, email, annualIncome, loanAmount } = input;

  if (typeof fullName !== "string") {
    errors.fullName = "Full name must be a valid string";
  } else if (fullName.trim().length === 0) {
    errors.fullName = "Full name is required";
  } else if (!/^[a-zA-Z\s]+$/.test(fullName)) {
    errors.fullName = "Full name must be valid characters only only letters";
  }

  if (typeof email !== "string") {
    errors.email = "Email must be a valid string";
  } else if (email.trim().length === 0) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email format";
  }

  if (annualIncome === undefined || annualIncome === null) {
    errors.annualIncome = "Annual income is required";
  } else if (annualIncome <= 0) {
    errors.annualIncome = "Annual income must be greater than 0";
  }

  if (loanAmount === undefined || loanAmount === null) {
    errors.loanAmount = "Loan amount is required";
  } else if (loanAmount <= 0) {
    errors.loanAmount = "Loan amount must be greater than 0";
  }

  return errors;
};

const validateLoanApplicationBusinessRules = (input: LoanApplicationInput): FieldErrors => {
  const errors: FieldErrors = {};
  const { annualIncome, loanAmount } = input;

  if (loanAmount > annualIncome * MAX_LOAN_INCOME_MULTIPLIER) {
    errors.loanAmount = `Loan amount cannot exceed ${MAX_LOAN_INCOME_MULTIPLIER}× annual income`;
  }

  return errors;
};

export const validateLoanApplication = (input: LoanApplicationInput): FieldErrors => {
  const baseErrors = validateBasicLoanApplicationFields(input);

  if (Object.keys(baseErrors).length > 0) {
    return baseErrors;
  }

  return validateLoanApplicationBusinessRules(input);
};
