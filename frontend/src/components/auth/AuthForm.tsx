"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  CreditCard,
  Heartbeat,
  ShieldCheck,
  ShoppingBagOpen,
  Storefront,
  UsersThree,
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";

import { AuthStatusDialog } from "@/components/auth/AuthStatusDialog";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import type { UserRole } from "@/types/roles";

type Mode = "login" | "register";
type SignupRole = Extract<UserRole, "customer" | "vendor" | "affiliate">;

const authFeatures = [
  {
    icon: ShieldCheck,
    title: "Cookie-first sessions",
    text: "Sign in once and keep your account state aligned with the backend session model.",
  },
  {
    icon: Heartbeat,
    title: "Role-aware onboarding",
    text: "Vendor and affiliate accounts continue into payment and approval instead of falling into dead ends.",
  },
  {
    icon: UsersThree,
    title: "Fast role routing",
    text: "Customer, vendor, affiliate, and admin accounts land in the right workspace immediately after auth.",
  },
];

const roleMeta: Record<
  SignupRole,
  {
    icon: typeof ShoppingBagOpen;
    title: string;
    eyebrow: string;
    description: string;
    nextStep: string;
  }
> = {
  customer: {
    icon: ShoppingBagOpen,
    title: "Customer account",
    eyebrow: "Storefront",
    description: "Checkout faster, track orders, and save delivery details.",
    nextStep: "Continue into your account and shopping flow.",
  },
  vendor: {
    icon: Storefront,
    title: "Vendor account",
    eyebrow: "Sell on Zoe",
    description: "Create your account, then choose whether to pay now or review your store setup first.",
    nextStep: "Next step: choose payment now or review store setup.",
  },
  affiliate: {
    icon: CreditCard,
    title: "Affiliate account",
    eyebrow: "Grow with Zoe",
    description: "Create your account, then choose whether to pay now or review your profile setup first.",
    nextStep: "Next step: choose payment now or review profile setup.",
  },
};

const getSafeNext = (rawNext: string | null) => {
  if (!rawNext || !rawNext.startsWith("/") || rawNext.startsWith("//")) {
    return "/";
  }

  return rawNext;
};

const getCustomerDestination = (rawNext: string | null) => {
  const next = getSafeNext(rawNext);
  if (
    next === "/" ||
    next.startsWith("/vendor") ||
    next.startsWith("/affiliate") ||
    next.startsWith("/admin")
  ) {
    return "/account/profile";
  }

  return next;
};

export const AuthForm = ({ mode }: { mode: Mode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();

  const next = searchParams.get("next");
  const { login, register, loading } = useAuth();

  const [selectedRole, setSelectedRole] = useState<SignupRole>("customer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [dialogRole, setDialogRole] = useState<Extract<UserRole, "vendor" | "affiliate"> | null>(null);

  const selectedRoleMeta = roleMeta[selectedRole];

  const closeDialog = () => setDialogRole(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email || !password || (mode === "register" && !fullName)) {
      setError("Please complete all required fields.");
      return;
    }

    if (mode === "register" && password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }

    if (mode === "login") {
      const result = await login(email, password);
      if (!result.ok) {
        if (
          result.paymentRequired &&
          (result.role === "vendor" || result.role === "affiliate")
        ) {
          setDialogRole(result.role);
          return;
        }

        setError(result.error ?? "Could not sign in.");
        return;
      }

      if (result.role === "admin") {
        router.push("/admin/dashboard");
        return;
      }
      if (result.role === "vendor") {
        router.push("/vendor/dashboard");
        return;
      }
      if (result.role === "affiliate") {
        router.push("/affiliate/dashboard");
        return;
      }
      router.push(getCustomerDestination(next));
      return;
    }

    const result = await register({
      fullName,
      email,
      password,
      role: selectedRole,
    });

    if (!result.ok) {
      setError(result.error ?? "Could not create account.");
      return;
    }

    if (result.role === "vendor") {
      router.push("/vendor-payment");
      return;
    }

    if (result.role === "affiliate") {
      router.push("/affiliate-payment");
      return;
    }

    router.push(getCustomerDestination(next));
  };

  return (
    <>
      <section className="auth-shell container">
        <motion.div
          className="auth-stage"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <aside className="auth-showcase">
            <div className="auth-showcase-copy">
              <span className="auth-kicker">
                {mode === "login" ? "Return to your workspace" : "Choose how you join"}
              </span>
              <h1>
                {mode === "login"
                  ? "A cleaner entry into every Zoe role."
                  : "One signup surface, three real account paths."}
              </h1>
              <p>
                {mode === "login"
                  ? "Sign in with any supported role and the frontend will route you to the right dashboard or onboarding step."
                  : "Create customer, vendor, or affiliate accounts from the same polished screen without masking backend capabilities."}
              </p>
            </div>

            <div className="auth-feature-list">
              {authFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.article
                    key={feature.title}
                    className="auth-feature-card"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.35,
                      delay: prefersReducedMotion ? 0 : 0.04 * (index + 1),
                    }}
                  >
                    <div className="auth-feature-icon">
                      <Icon size={20} weight="duotone" />
                    </div>
                    <div>
                      <h2>{feature.title}</h2>
                      <p>{feature.text}</p>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <div className="auth-demo-note">
              <span>Demo access</span>
              <p>
                `admin@example.com`, `customer@example.com`, `vendor@example.com`, and
                `affiliate@example.com` with password `password123`.
              </p>
            </div>
          </aside>

          <motion.form
            className="auth-card auth-card-elevated"
            onSubmit={submit}
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.38, delay: prefersReducedMotion ? 0 : 0.08 }}
          >
            <div className="auth-card-header">
              <div>
                <span className="auth-card-kicker">
                  {mode === "login" ? "Sign in" : selectedRoleMeta.eyebrow}
                </span>
                <h2>{mode === "login" ? "Welcome back" : selectedRoleMeta.title}</h2>
              </div>
              <p>
                {mode === "login"
                  ? "Use the credentials tied to your account. We will handle routing and payment requirements after submission."
                  : selectedRoleMeta.description}
              </p>
            </div>

            {mode === "register" ? (
              <div className="auth-role-grid" role="radiogroup" aria-label="Select account role">
                {(Object.entries(roleMeta) as Array<[SignupRole, (typeof roleMeta)[SignupRole]]>).map(
                  ([role, meta]) => {
                    const Icon = meta.icon;
                    const active = selectedRole === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        className={`auth-role-card ${active ? "auth-role-card-active" : ""}`}
                        onClick={() => setSelectedRole(role)}
                        aria-pressed={active}
                      >
                        <div className="auth-role-icon">
                          <Icon size={20} weight={active ? "fill" : "duotone"} />
                        </div>
                        <div>
                          <strong>{meta.title}</strong>
                          <span>{meta.nextStep}</span>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            ) : null}

            <div className="auth-form-grid">
              {mode === "register" ? (
                <TextField
                  label="Full name"
                  value={fullName}
                  name="fullName"
                  placeholder="e.g. Samira Rahman"
                  autoComplete="name"
                  onChange={(event) => setFullName(event.target.value)}
                />
              ) : null}
              <TextField
                label="Email address"
                value={email}
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
              />
              <TextField
                label="Password"
                value={password}
                name="password"
                type="password"
                placeholder={mode === "register" ? "Create a secure password" : "Enter your password"}
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                hint={mode === "register" ? "Minimum 8 characters." : "Vendor and affiliate payment checks happen after authentication."}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {error ? <p className="form-error auth-form-error">{error}</p> : null}

            <div className="auth-form-actions">
              <Button disabled={loading} className="auth-submit-btn">
                {loading
                  ? "Please wait..."
                  : mode === "login"
                    ? "Sign in"
                    : `Create ${selectedRole === "customer" ? "customer" : selectedRole} account`}
              </Button>
              <p className="auth-inline-note">
                {mode === "login"
                  ? "No extra selector needed. Your existing account role decides the next destination."
                  : selectedRoleMeta.nextStep}
              </p>
            </div>

            <div className="auth-switch auth-switch-rich">
              {mode === "login" ? (
                <p>
                  New to Zoe Market? <Link href="/auth/register">Create an account</Link>
                </p>
              ) : (
                <p>
                  Already have an account? <Link href="/auth/login">Sign in instead</Link>
                </p>
              )}
              <span className="auth-switch-arrow">
                <ArrowRight size={16} weight="bold" />
              </span>
            </div>
          </motion.form>
        </motion.div>
      </section>

      <AuthStatusDialog
        open={dialogRole !== null}
        title={
          dialogRole === "vendor"
            ? "Vendor onboarding payment is still pending"
            : "Affiliate onboarding payment is still pending"
        }
        description={
          dialogRole === "vendor"
            ? "Your vendor account is active. You can review store setup now, or go to the payment page whenever you are ready to submit it for approval."
            : "Your affiliate account is active. You can review profile setup now, or go to the payment page whenever you are ready to submit it for approval."
        }
        actionHref={dialogRole === "vendor" ? "/vendor-payment" : "/affiliate-payment"}
        actionLabel={dialogRole === "vendor" ? "Continue vendor onboarding" : "Continue affiliate onboarding"}
        onClose={closeDialog}
      />
    </>
  );
};
