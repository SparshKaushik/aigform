"use client";

import { PanelLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { usePathname } from "next/navigation";
import { navRoutes, routesNames } from "~/lib/constants";
import { signOut } from "next-auth/react";
import { type Session } from "next-auth";

export default function Header(props: { session: Session | null }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center gap-4 border-b bg-background bg-opacity-100 px-4 py-2 md:static md:h-auto md:border-0 md:bg-transparent md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="lg:hidden">
            <PanelLeft className="size-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:text-base"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* <img
                src="/logo.webp"
                alt="AI Google Form"
                className="size-8 object-contain"
              /> */}
              <span className={"sr-only"}>AI Google Form</span>
            </Link>
            {navRoutes.map((route) => (
              <Link
                key={route.title}
                href={`${route.route}`}
                className={
                  "flex w-full items-center gap-3 rounded-lg p-3 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                }
              >
                <route.icon className="size-5" />
                {route.title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden lg:flex">
        <BreadcrumbList>
          {(pathname === "/" ? [""] : pathname.split("/")).map(
            (path, index, list) =>
              path !== "" && (
                <div className="flex items-center gap-2" key={index}>
                  <BreadcrumbItem>
                    {index === list.length - 1 ? (
                      <BreadcrumbPage>{routesNames[path] ?? ""}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link
                          href={`/${pathname
                            .split("/")
                            .slice(1, index + 1)
                            .join("/")}`}
                        >
                          {routesNames[path] ?? ""}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < list.length - 1 && <BreadcrumbSeparator />}
                </div>
              ),
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="ml-auto overflow-hidden rounded-full"
          >
            <Avatar>
              <AvatarImage
                src={props.session?.user?.image ?? ""}
                referrerPolicy="no-referrer"
              />
              <AvatarFallback>
                {props.session?.user?.name
                  ?.split(" ")
                  .map((s) => s[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-40" align="end">
        <DropdownMenuLabel>
            {props.session?.user?.name ?? ""}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
