import { signOut } from "@/auth";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <Button
        className="cursor-pointer"
        variant="outline"
        size="sm"
        type="submit"
      >
        <LogOut /> Sign Out
      </Button>
    </form>
  );
}
