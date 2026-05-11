"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import type { Occupation, Profile } from "@/lib/types";

interface OnboardingFlowProps {
  profile: Profile | null;
}

const occupationOptions: Occupation[] = [
  "Student",
  "Freelancer",
  "Employee",
  "Entrepreneur",
  "Other"
];

function getInitialStep(profile: Profile | null) {
  if (!profile?.full_name?.trim()) return 0;
  if (!profile?.phone_number?.trim()) return 1;
  if (!profile?.occupation || !profile?.age) return 2;
  return 3;
}

export function OnboardingFlow({ profile }: OnboardingFlowProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [step, setStep] = useState(getInitialStep(profile));
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone_number ?? "");
  const [age, setAge] = useState(profile?.age ? String(profile.age) : "");
  const [occupation, setOccupation] = useState<Occupation | "">(profile?.occupation ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function updateProfile(values: Record<string, string | number | boolean | null>) {
    if (!profile?.id) return;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        ...values,
        updated_at: new Date().toISOString()
      })
      .eq("id", profile.id);

    if (updateError) {
      throw updateError;
    }
  }

  function handleSkip() {
    setError(null);
    startTransition(async () => {
      try {
        await updateProfile({ completed_onboarding: false });
        router.push("/dashboard");
        router.refresh();
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Could not skip right now.");
      }
    });
  }

  function handleNext() {
    setError(null);

    startTransition(async () => {
      try {
        if (step === 0) {
          if (!fullName.trim()) {
            setError("Please add your full name or skip for now.");
            return;
          }

          await updateProfile({ full_name: fullName.trim(), email: profile?.email ?? null });
          setStep(1);
          return;
        }

        if (step === 1) {
          await updateProfile({ phone_number: phoneNumber.trim() || null });
          setStep(2);
          return;
        }

        if (step === 2) {
          await updateProfile({
            age: age ? Number(age) : null,
            occupation: occupation || null
          });
          setStep(3);
          return;
        }

        await updateProfile({
          full_name: fullName.trim() || null,
          phone_number: phoneNumber.trim() || null,
          age: age ? Number(age) : null,
          occupation: occupation || null,
          completed_onboarding: true
        });
        router.push("/dashboard");
        router.refresh();
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Could not save your progress.");
      }
    });
  }

  return (
    <Card className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-sm">
      <CardHeader className="space-y-4 p-8 pb-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">Step {Math.min(step + 1, 3)} of 3</div>
          <button
            type="button"
            onClick={handleSkip}
            disabled={isPending}
            className="text-sm text-slate-400 hover:text-slate-900"
          >
            Skip for now
          </button>
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className={`h-2.5 w-2.5 rounded-full ${
                dot <= step ? "bg-indigo-600" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
        <div className="space-y-2 text-center">
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
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-8 pb-8 pt-0">
        {step === 0 ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <CardTitle>Welcome to Sawa. Let&apos;s set up your profile.</CardTitle>
              <p className="text-sm text-slate-500">Start with the name you want your cohort to know you by.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Your full name"
                className="h-12"
              />
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <CardTitle>How can we reach you fast?</CardTitle>
              <p className="text-sm text-slate-500">
                Phone number is optional, but it helps a lot with cohort coordination.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone number</Label>
              <Input
                id="phone_number"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="+970 ..."
                className="h-12"
              />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <CardTitle>Quick profile info</CardTitle>
              <p className="text-sm text-slate-500">A little context helps us place you in the right cohort rhythm.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(event) => setAge(event.target.value)}
                placeholder="18"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <select
                id="occupation"
                value={occupation}
                onChange={(event) => setOccupation(event.target.value as Occupation | "")}
                className="flex h-12 w-full rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] outline-none transition-colors focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
              >
                <option value="">Select one</option>
                {occupationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-5 text-center">
            <div className="space-y-2">
              <CardTitle>You&apos;re ready to build.</CardTitle>
              <p className="text-sm text-slate-500">
                Your profile is in place. You can always update it later from your dashboard.
              </p>
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {error}
          </div>
        ) : null}

        <Button className="w-full" onClick={handleNext} disabled={isPending}>
          {step === 3 ? "Go to Dashboard →" : isPending ? "Saving..." : "Continue"}
        </Button>
      </CardContent>
    </Card>
  );
}
