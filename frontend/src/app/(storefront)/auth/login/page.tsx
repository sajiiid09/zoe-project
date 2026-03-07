import { Suspense } from "react";

import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<section className="auth-shell container"><div className="auth-card"><p>Loading sign in...</p></div></section>}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
