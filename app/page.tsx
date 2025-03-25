import SignIn from "@/components/sign-in";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <Card>
        <CardContent>
          <p className="text-sm  mb-4">
            To prevent abuse, we require GitHub authentication before dispensing
            tokens. Your account must be at least 30 days old with some
            activity.
          </p>
          <SignIn />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Maximum 50 JUNOx every 12 hours.
          </p>
        </CardFooter>
      </Card>
    </>
  );
}
