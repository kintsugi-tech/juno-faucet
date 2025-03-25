import { auth } from "@/auth";
import { SignOut } from "@/components/sign-out";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FaucetForm } from "@/components/faucet-form";

export default async function Dashboard() {
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;

  return (
    <>
      <Card>
        <CardContent>
          <FaucetForm />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Maximum 100 JUNOx every 12 hours.
          </p>
        </CardFooter>
      </Card>

      <div>
        <SignOut />
      </div>
    </>
  );
}
