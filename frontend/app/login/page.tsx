import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-lg py-10">
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-semibold">Login</h1>
        <p className="text-ink/70">Access your player or scout workspace.</p>
      </div>
      <AuthForm mode="login" />
    </div>
  );
}
