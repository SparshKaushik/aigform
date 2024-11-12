import "~/styles/globals.css";

import { Poppins } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import ThemeSwitcher from "~/components/ThemeSwitcher";
import { Suspense } from "react";
import { Loader2Icon } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "AI Google Form Assistant",
  description: "AI Google Form Assistant",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="m-0 h-dvh overflow-hidden p-0">
      <body
        className={`flex h-dvh flex-col bg-background font-sans antialiased ${poppins.variable}`}
      >
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <Loader2Icon className="size-8 animate-spin" />
            </div>
          }
        >
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <ThemeSwitcher />
              <Toaster position="top-right" />
              {children}
            </ThemeProvider>
          </SessionProvider>
        </Suspense>
      </body>
    </html>
  );
}
