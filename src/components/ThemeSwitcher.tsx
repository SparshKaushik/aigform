"use client";

import { settings$ } from "~/lib/states/settings";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";
import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const theme = useTheme();
  const settings = settings$.get();

  useEffect(() => {
    if (!settings.theme) {
      settings$.set((s) => ({
        ...s,
        theme: "system",
      }));
    }
  }, [settings]);

  useEffect(() => {
    theme.setTheme(settings.theme);
  }, [settings.theme, theme]);

  return (
    <div className="fixed bottom-3 right-3">
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          settings$.set((s) => ({
            ...s,
            theme:
              s.theme === "light"
                ? "dark"
                : s.theme === "dark"
                  ? "system"
                  : "light",
          }));
        }}
      >
        {settings.theme === "light" ? (
          <SunIcon className="size-5" />
        ) : settings.theme === "dark" ? (
          <MoonIcon className="size-5" />
        ) : (
          <SunMoonIcon className="size-5" />
        )}
      </Button>
    </div>
  );
}
