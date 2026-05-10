"use client";

import { useState } from "react";
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

  const isSignup = mode === "signup";

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

      window.location.assign("/dashboard");
    } catch (err) {
      const nextMessage =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(nextMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-6 text-center">
        <div className="space-y-2">
          <div className="text-3xl font-bold tracking-tight text-[#4F46E5]">SAWA</div>
          <p className="text-sm text-slate-500">{t("tagline")}</p>
        </div>
        <div className="space-y-1">
          <CardTitle>{isSignup ? "Create your account" : "Welcome back"}</CardTitle>
          <CardDescription>
            {isSignup
              ? "Join the builder community platform."
              : "Sign in to keep building with your community."}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
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
          <Button className="w-full" type="submit" disabled={loading}>
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
            <Link className="font-medium text-[#4F46E5] hover:text-[#4338CA]" href="/login">
              Already building? {t("login")} →
            </Link>
          ) : (
            <Link className="font-medium text-[#4F46E5] hover:text-[#4338CA]" href="/signup">
              {t("signup")} →
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
