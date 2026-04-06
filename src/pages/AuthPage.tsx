import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Chrome, UserRoundPlus, LogIn } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

type AuthMode = "signup" | "login";

interface AuthPageProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onSuccess: () => void;
}

export function AuthPage({ mode, onModeChange, onSuccess }: AuthPageProps) {
  const { theme } = useTheme();
  const { signInWithGoogle } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isSignup = mode === "signup";

  const helperText = useMemo(() => {
    if (isSignup) {
      return "Create your DevSath account and continue to profile setup.";
    }
    return "Welcome back. Log in to continue building your team.";
  }, [isSignup]);

  const mapFirebaseError = (code: string) => {
    switch (code) {
      case "auth/popup-closed-by-user":
        return "Google sign-in popup was closed. Please try again.";
      case "auth/cancelled-popup-request":
        return "Another popup was opened. Please try again.";
      default:
        return "Authentication failed. Please try again.";
    }
  };

  const handleGoogleAuth = async () => {
    setError("");

    try {
      setIsSubmitting(true);
      await signInWithGoogle();
      onSuccess();
    } catch (err: unknown) {
      const code =
        typeof err === "object" && err && "code" in err
          ? String((err as { code: string }).code)
          : "";
      setError(mapFirebaseError(code));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-14 px-6 bg-[#F8FAFC] dark:bg-[#0B1020]">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-stretch">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-3xl p-8 md:p-10 bg-gradient-to-br from-violet-600 to-blue-600 text-white relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-60 w-60 rounded-full bg-black/15 blur-3xl" />

          <div className="relative z-10">
            <p className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full bg-white/15 mb-4">
              <UserRoundPlus className="w-4 h-4" />
              Account Access
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Build faster with
              <br />
              your best team.
            </h1>

            <p className="text-white/90 text-lg leading-relaxed max-w-xl">
              {helperText}
            </p>

            <div className="mt-8 space-y-3 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-300" />
                Smart teammate matching based on your profile.
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-300" />
                Persisted login so you do not need to sign in every time.
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-300" />
                Continue directly into the existing onboarding flow.
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className={`rounded-3xl border p-8 md:p-10 ${
            theme === "dark"
              ? "bg-[#121A2B] border-white/10"
              : "bg-white border-black/10"
          } shadow-xl`}
        >
          <div className="flex items-center gap-2 p-1 mb-6 rounded-xl bg-black/5 dark:bg-white/5">
            <button
              onClick={() => onModeChange("signup")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isSignup
                  ? "bg-gradient-to-r from-violet-500 to-blue-500 text-white"
                  : theme === "dark"
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
              }`}
              type="button"
            >
              Sign Up
            </button>
            <button
              onClick={() => onModeChange("login")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                !isSignup
                  ? "bg-gradient-to-r from-violet-500 to-blue-500 text-white"
                  : theme === "dark"
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
              }`}
              type="button"
            >
              Log In
            </button>
          </div>

          <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">
            {isSignup ? "Create account" : "Welcome back"}
          </h2>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-6">
            {isSignup
              ? "Use Google to create your DevSath account."
              : "Continue with your Google account."}
          </p>

          <div className="space-y-4">
            {error && (
              <div className="text-sm rounded-lg px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-500">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-violet-500 to-blue-500 hover:opacity-90 transition-opacity disabled:opacity-70 inline-flex items-center justify-center gap-2"
            >
              <Chrome className="w-5 h-5" />
              {isSubmitting
                ? "Please wait..."
                : isSignup
                  ? "Sign Up with Google"
                  : "Sign In with Google"}
            </button>

            <button
              type="button"
              onClick={() => onModeChange(isSignup ? "login" : "signup")}
              className="w-full py-2 text-sm text-violet-500 dark:text-violet-400 font-medium"
            >
              {isSignup ? (
                <span className="inline-flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Already have an account? Log in
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <UserRoundPlus className="w-4 h-4" />
                  New here? Create an account
                </span>
              )}
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
