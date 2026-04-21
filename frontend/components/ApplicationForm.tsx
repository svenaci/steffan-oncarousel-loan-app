"use client";

import { useState } from "react";
import type { ChangeEvent, SubmitEventHandler } from "react";
import FormField from "./FormField";
import ApplicationPendingView from "./ApplicationPendingView";
import { createApplication, getApplication, ApiError } from "../lib/api";
import { validateLoanApplication } from "../lib/validation";
import { FieldErrors, LoanApplication, LoanApplicationInput } from "../lib/types";

type FormValues = {
  fullName: string;
  email: string;
  annualIncome: string;
  loanAmount: string;
};

export default function ApplicationForm() {
  const [values, setValues] = useState<FormValues>({
    fullName: "",
    email: "",
    annualIncome: "",
    loanAmount: "",
  });

  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverFieldErrors, setServerFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [application, setApplication] = useState<LoanApplication | null>(null);

  const parsedValues: LoanApplicationInput = {
    fullName: values.fullName,
    email: values.email,
    annualIncome: Number(values.annualIncome),
    loanAmount: Number(values.loanAmount),
  };

  const clientErrors = validateLoanApplication(parsedValues);
  const combinedErrors: FieldErrors = {
    ...clientErrors,
    ...serverFieldErrors,
  };

  const showError = (field: keyof FormValues) => {
    return submitted || touched[field];
  };

  const handleChange =
    (field: keyof FormValues) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      setServerFieldErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));

      if (submitError) {
        setSubmitError("");
      }
    };

  const handleBlur =
    (field: keyof FormValues) =>
    () => {
      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }));
    };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setSubmitError("");
    setServerFieldErrors({});

    if (Object.keys(clientErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await createApplication(parsedValues);
      const savedApplication = await getApplication(created.id);
      setApplication(savedApplication);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.fieldErrors) {
          setServerFieldErrors(error.fieldErrors);
        } else {
          setSubmitError(error.message);
        }
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (application) {
    return <ApplicationPendingView application={application} />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      {submitError ? (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}

      {isSubmitting && (
        <p className="text-sm text-gray-600">Submitting your application...</p>
      )}
      
      <FormField
        id="fullName"
        label="Full Name"
        value={values.fullName}
        onChange={handleChange("fullName")}
        onBlur={handleBlur("fullName")}
        error={showError("fullName") ? combinedErrors.fullName : undefined}
        placeholder="Enter your full legal name"
      />

      <FormField
        id="email"
        label="Email"
        type="email"
        value={values.email}
        onChange={handleChange("email")}
        onBlur={handleBlur("email")}
        error={showError("email") ? combinedErrors.email : undefined}
        placeholder="name@example.com"
      />

      <FormField
        id="annualIncome"
        label="Annual Income"
        type="number"
        value={values.annualIncome}
        onChange={handleChange("annualIncome")}
        onBlur={handleBlur("annualIncome")}
        error={showError("annualIncome") ? combinedErrors.annualIncome : undefined}
        placeholder="Enter your annual income before taxes"
      />

      <FormField
        id="loanAmount"
        label="Loan Amount"
        type="number"
        value={values.loanAmount}
        onChange={handleChange("loanAmount")}
        onBlur={handleBlur("loanAmount")}
        error={showError("loanAmount") ? combinedErrors.loanAmount : undefined}
        placeholder="Enter the amount you want to borrow"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Apply"}
      </button>
    </form>
  );
}