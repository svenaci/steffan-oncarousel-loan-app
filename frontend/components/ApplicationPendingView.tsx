import { LoanApplication } from "../lib/types";

type ApplicationSummaryProps = {
  application: LoanApplication;
};

export default function ApplicationSummary({application}: ApplicationSummaryProps) {
  return (
    <section className="rounded border border-gray-200 p-4">
      <h2 className="text-xl font-semibold">Pending Review</h2>
      <p className="mt-1 text-sm text-gray-600">
        Your application has been submitted successfully.
      </p>

      <dl className="mt-4 grid gap-3">
        <div>
          <dt className="text-sm font-medium text-gray-700">Application ID</dt>
          <dd className="text-sm text-gray-900">{application.id}</dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-gray-700">Status</dt>
          <dd className="text-sm text-gray-900">{application.status}</dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-gray-700">Full Name</dt>
          <dd className="text-sm text-gray-900">{application.fullName}</dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-gray-700">Email</dt>
          <dd className="text-sm text-gray-900">{application.email}</dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-gray-700">Annual Income</dt>
          <dd className="text-sm text-gray-900">{application.annualIncome}</dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-gray-700">Loan Amount</dt>
          <dd className="text-sm text-gray-900">{application.loanAmount}</dd>
        </div>
      </dl>
    </section>
  );
}