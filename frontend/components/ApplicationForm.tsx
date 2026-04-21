"use client";

import { useState } from "react";
import type { ChangeEvent, SubmitEventHandler } from "react";
import FormField from "./FormField";
import { validateLoanApplication } from "../lib/validation";

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

  const parsedValues = {
    fullName: values.fullName,
    email: values.email,
    annualIncome: Number(values.annualIncome),
    loanAmount: Number(values.loanAmount),
  };

  const errors = validateLoanApplication(parsedValues);

  const showError = (field: keyof FormValues) => {
    return submitted || touched[field];
  };

  const handleChange = (field: keyof FormValues) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleBlur = (field: keyof FormValues) =>
    () => {
      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }));
    };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);

    try { 
      console.log("Submitting", parsedValues);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <FormField
        id="fullName"
        label="Full Name"
        value={values.fullName}
        onChange={handleChange("fullName")}
        onBlur={handleBlur("fullName")}
        error={showError("fullName") ? errors.fullName : undefined}
        placeholder="Enter full name (e.g. Steffan Venacious)"
      />

      <FormField
        id="email"
        label="Email"
        type="email"
        value={values.email}
        onChange={handleChange("email")}
        onBlur={handleBlur("email")}
        error={showError("email") ? errors.email : undefined}
        placeholder="Enter email (e.g. steff.venacious@gmail.com)"
      />

      <FormField
        id="annualIncome"
        label="Annual Income"
        type="number"
        value={values.annualIncome}
        onChange={handleChange("annualIncome")}
        onBlur={handleBlur("annualIncome")}
        error={
          showError("annualIncome") ? errors.annualIncome : undefined
        }
        placeholder="0"
      />

      <FormField
        id="loanAmount"
        label="Loan Amount"
        type="number"
        value={values.loanAmount}
        onChange={handleChange("loanAmount")}
        onBlur={handleBlur("loanAmount")}
        error={
          showError("loanAmount") ? errors.loanAmount : undefined
        }
        placeholder="0"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Apply"}
      </button>
    </form>
  );
}