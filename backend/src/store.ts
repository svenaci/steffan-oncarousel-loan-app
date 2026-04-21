import { LoanApplication } from "./lib/types";

const applications = new Map<string, LoanApplication>();

export const saveApplication = (application: LoanApplication): void => {
  applications.set(application.id, application);
};

export const getApplicationById = (id: string): LoanApplication | undefined => {
  return applications.get(id);
};

export const clearApplications = (): void => {
  applications.clear();
};