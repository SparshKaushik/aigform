"use client";

import { signIn } from "next-auth/react";

import { Button } from "./ui/button";
import { GoogleIcon } from "./ui/icons";
import { useMediaQuery } from "~/lib/utils.client";

export function LoginButton() {
  return (
    <Button
      className="group gap-2"
      onClick={async () => {
        await signIn("google");
      }}
    >
      <GoogleIcon />
      Login
    </Button>
  );
}

export function ResponsiveElement({
  desktopElement,
  mobileElement,
}: {
  desktopElement: React.ReactNode;
  mobileElement?: React.ReactNode;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? <>{desktopElement}</> : <>{mobileElement}</>;
}
