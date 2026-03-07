import { Suspense } from "react";

import { AuthForm } from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <Suspense fallback={<section className="auth-shell container"><div className="auth-card"><p>Loading registration...</p></div></section>}>
      <AuthForm mode="register" />
    </Suspense>
  );
}
