import ApplicationForm from "../components/ApplicationForm";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-2 text-3xl font-bold">Loan Application</h1>
        <p className="mb-6 text-sm text-gray-600">
          Complete the form below to submit your loan application.
        </p>

        <ApplicationForm />
      </div>
    </main>
  );
}
