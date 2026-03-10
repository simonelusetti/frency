import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-lg py-10">
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-semibold">Register</h1>
        <p className="text-ink/70">Choose a role and create a local account for the prototype.</p>
      </div>
      <AuthForm mode="register" />
    </div>
  );
}
