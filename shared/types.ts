export type ApplicationStatus = "pending";

export type LoanApplicationInput = {
  fullName: string;
  email: string;
  annualIncome: number;
  loanAmount: number;
};

export type LoanApplication = LoanApplicationInput & {
  id: string;
  status: ApplicationStatus;
};

export type FieldErrors = Partial<Record<keyof LoanApplicationInput, string>>;