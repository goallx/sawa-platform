"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";

import { useRouter } from "@/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton({ collapsed = false }: { collapsed?: boolean }) {
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
      className={collapsed ? "h-9 w-9 p-0" : "min-w-[88px] gap-2"}
      onClick={handleLogout}
      disabled={loading}
      title={collapsed ? "Logout" : undefined}
    >
      <LogOut className="h-4 w-4" />
      {collapsed ? null : loading ? "Logging out..." : "Logout"}
    </Button>
  );
}
