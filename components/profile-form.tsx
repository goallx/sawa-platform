"use client";

import { useRef, useState, useTransition } from "react";

import { saveProfile } from "@/app/(dashboard)/profile/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Profile } from "@/lib/types";

interface ProfileFormProps {
  profile: Profile | null;
  userEmail: string | null;
  completionPercentage: number;
  missingCriticalFields: boolean;
}

const occupationOptions = ["Student", "Freelancer", "Employee", "Entrepreneur", "Other"] as const;

export function ProfileForm({
  profile,
  userEmail,
  completionPercentage,
  missingCriticalFields: _missingCriticalFields
}: ProfileFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!formRef.current) return;

    setMessage(null);
    setError(null);
    const formData = new FormData(formRef.current);

    startTransition(async () => {
      try {
        await saveProfile(formData);
        setMessage("Profile saved.");
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Could not save profile.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-900">Profile completion</p>
            <p className="text-sm text-slate-500">{completionPercentage}% complete</p>
          </div>
          <div className="h-2.5 w-32 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <form ref={formRef} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={profile?.email ?? userEmail ?? ""}
            disabled
            readOnly
            className="bg-slate-50 text-slate-500 disabled:cursor-not-allowed disabled:opacity-100"
          />
          <p className="text-xs text-slate-400">
            Your email comes from your login account and can&apos;t be changed here.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" name="full_name" defaultValue={profile?.full_name ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone number</Label>
            <Input id="phone_number" name="phone_number" defaultValue={profile?.phone_number ?? ""} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            name="bio"
            maxLength={200}
            defaultValue={profile?.bio ?? ""}
            rows={4}
            className="flex w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-slate-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" defaultValue={profile?.location ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" name="age" type="number" defaultValue={profile?.age ?? ""} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupation">Occupation</Label>
          <select
            id="occupation"
            name="occupation"
            defaultValue={profile?.occupation ?? ""}
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

        {message ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {error}
          </div>
        ) : null}

        <Button type="button" onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
