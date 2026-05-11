"use client";

import { useState } from "react";
import { Chrome } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, useRouter } from "@/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";

interface AuthFormProps {
  mode: AuthMode;
}

export function AuthForm({ mode }: AuthFormProps) {
  const t = useTranslations("common");
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const isSignup = mode === "signup";

  async function handleGoogleAuth() {
    setError(null);
    setMessage(null);
    setOauthLoading(true);

    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo
        }
      });

      if (oauthError) {
        throw oauthError;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start Google sign-in.");
      setOauthLoading(false);
    }
  }

  async function syncProfileEmail(userId: string, nextEmail: string | null) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        email: nextEmail,
        updated_at: new Date().toISOString()
      })
      .eq("id", userId);

    if (updateError) {
      throw updateError;
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password
        });

        if (signUpError) {
          throw signUpError;
        }

        if (!data.session) {
          setMessage(
            "Account created. Check your email to confirm your account before signing in."
          );
          return;
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          throw signInError;
        }

        if (!data.session) {
          throw new Error("Sign in did not create a session. Please try again.");
        }
      }

      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user;
      const userId = currentUser?.id;

      if (!userId) {
        throw new Error("Could not find your account after authentication.");
      }

      await syncProfileEmail(userId, currentUser.email ?? null);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("completed_onboarding, full_name")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      const nextPath = isSignup
        ? "/onboarding"
        : !profile?.completed_onboarding && !profile?.full_name?.trim()
          ? "/onboarding"
          : "/dashboard";

      router.push(nextPath);
      router.refresh();
    } catch (err) {
      const nextMessage =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(nextMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-sm">
      <CardHeader className="space-y-6 p-8 pb-6 text-center">
        <div className="mb-2 space-y-2">
          <div className="inline-flex items-center justify-center gap-2 text-2xl font-bold tracking-tight text-indigo-600">
            <span>SAWA</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 12 12"
              className="h-3 w-3 -translate-y-0.5 fill-indigo-600"
            >
              <path d="M1 2h6.2L4.6 0l1.4 0L11 5.5 6 11 4.6 11l2.6-2H1z" />
            </svg>
          </div>
          <p className="text-sm text-slate-400">{t("tagline")}</p>
        </div>
        <div className="space-y-1">
          <CardTitle>{isSignup ? t("createAccountTitle") : t("welcomeBack")}</CardTitle>
          <CardDescription>
            {isSignup ? t("signupDescription") : t("loginDescription")}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-8 pb-8 pt-0">
        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={handleGoogleAuth}
            disabled={oauthLoading || loading}
          >
            <Chrome className="h-4 w-4" />
            {oauthLoading ? "Connecting..." : t("continueWithGoogle")}
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
              {t("orContinueWithEmail")}
            </p>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="builder@sawa.so"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder="Enter your password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {isSignup ? (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm your password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>
          ) : null}
          {message ? <p className="text-sm text-slate-500">{message}</p> : null}
          {error ? <p className="text-sm text-[#4F46E5]">{error}</p> : null}
          <Button className="w-full" type="submit" disabled={loading || oauthLoading}>
            {loading
              ? isSignup
                ? "Creating account..."
                : "Signing in..."
              : isSignup
                ? "Create Account"
                : "Sign In"}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-500">
          {isSignup ? (
            <span>
              {t("alreadyHaveAccount")}{" "}
              <Link className="font-medium text-[#4F46E5] hover:underline" href="/login">
                {t("login")}
              </Link>
            </span>
          ) : (
            <span>
              {t("newHere")}{" "}
              <Link className="font-medium text-[#4F46E5] hover:underline" href="/signup">
                {t("joinSawa")}
              </Link>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
