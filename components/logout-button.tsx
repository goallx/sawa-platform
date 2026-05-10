"use client";

import { useState } from "react";

import { useRouter } from "@/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
    setLoading(false);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="min-w-[88px]"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
}
