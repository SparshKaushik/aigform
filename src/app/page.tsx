import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Link from "next/link";
import { auth } from "~/server/auth";
import { LoginButton } from "~/components/Common";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen w-[80vw] flex-col items-center self-center py-4">
      <div className="flex w-full items-center justify-between">
        <div></div>
        <div className="flex items-center gap-4">
          {session?.user ? (
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
          ) : null}
          {session?.user ? (
            <Avatar>
              <AvatarImage
                src={session?.user?.image ?? ""}
                referrerPolicy="no-referrer"
              />
              <AvatarFallback>
                {session?.user?.name
                  ?.split(" ")
                  .map((s) => s[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </main>
  );
}
