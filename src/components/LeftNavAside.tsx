"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "~/lib/utils";
import { navRoutes } from "~/lib/constants";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BotIcon } from "lucide-react";

export default function LeftNavAside() {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "z-10 hidden w-14 flex-col border-r bg-background transition-all duration-300 lg:flex",
          "group hover:w-[15vw]",
        )}
      >
        <div className="flex h-full flex-col gap-4 px-2 md:py-3">
          <div
            className={cn(
              "flex min-h-14 items-center border-b lg:min-h-[60px]",
              "flex-col-reverse gap-4 pb-8", // not expandNav
              "group-hover:flex-row group-hover:justify-between group-hover:pb-0 group-hover:pl-2 group-hover:2xl:pl-4", // expandNav
            )}
          >
            <Link href="/" className="flex items-center gap-2 font-semibold">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* <img
                src="/logo.webp"
                alt="AI Google Form"
                className="size-8 object-contain"
              /> */}
              <BotIcon className="size-5" />
              <span className="sr-only opacity-0 delay-300 duration-300 hover:delay-0 group-hover:not-sr-only group-hover:opacity-100">
                AI Google Form
              </span>
            </Link>
          </div>
          <div className="flex-1">
            <nav
              className={cn(
                "flex h-full flex-col items-start gap-2 text-sm font-medium",
                "items-center",
                "group-hover:px-2",
              )}
            >
              {navRoutes.map((route) => (
                <Tooltip key={route.title}>
                  <TooltipTrigger asChild>
                    <Link
                      href={`${route.route}`}
                      className={cn(
                        "relative flex w-full items-center gap-3 rounded-lg p-3 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground",
                        pathname === route.route &&
                          "bg-accent text-accent-foreground",
                      )}
                    >
                      <route.icon className="size-5" />
                      <span className="sr-only opacity-0 delay-300 duration-300 hover:delay-0 group-hover:not-sr-only group-hover:opacity-100">
                        {route.title}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent className="group-hover:hidden" side="right">
                    {route.title}
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
