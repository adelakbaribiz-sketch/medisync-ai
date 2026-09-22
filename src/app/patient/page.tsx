import { Topbar } from "@/components/layout/Topbar";
import { PatientProfileForm } from "@/components/patient/PatientProfileForm";

export default function PatientPage() {
  return (
    <>
      <Topbar
        title="Patient Profile"
        description="Physiological context used to adjust interaction guidance. Stored only in this browser."
      />
      <main className="flex-1 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <PatientProfileForm />
        </div>
      </main>
    </>
  );
}
