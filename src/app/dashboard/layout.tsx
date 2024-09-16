import { redirect } from "next/navigation";
import Header from "~/components/Header";
import LeftNavAside from "~/components/LeftNavAside";
import { auth } from "~/server/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="flex h-dvh overflow-hidden">
      <LeftNavAside />
      <div className="flex flex-1 flex-col overflow-hidden sm:gap-4 md:py-4">
        <Header />
        {children}
      </div>
    </div>
  );
}
