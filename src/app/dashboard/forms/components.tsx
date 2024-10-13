"use client";

import {
  CircleArrowDownIcon,
  CopyIcon,
  Link2Icon,
  Loader2Icon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button, buttonVariants } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { DialogClose, DialogFooter } from "~/components/ui/dialog";
import { DrawerClose, DrawerFooter } from "~/components/ui/drawer";
import { ResponsiveDrawerDialog } from "~/components/ui/responsive-dialog";
import { cn } from "~/lib/utils";
import { importForms } from "~/server/db/models/form";
import { getFormsFromDrive } from "~/server/gapi/drive";

export function ImportFormDialog({ trigger }: { trigger: React.ReactNode }) {
  const [forms, setForms] = useState<
    {
      id: string;
      name: string;
      selected: boolean;
    }[]
  >();
  const [isLoading, setIsLoading] = useState(false);

  const Content = ({ type }: { type: "dialog" | "drawer" }) => {
    const FooterRoot = type === "dialog" ? DialogFooter : DrawerFooter;
    const CloseContainer = type === "dialog" ? DialogClose : DrawerClose;

    return (
      <>
        {!forms ? (
          <div className="flex h-full w-full flex-1 items-center justify-center">
            <Button
              onClick={async () => {
                if (isLoading) return;
                setIsLoading(true);
                setForms(
                  (
                    await getFormsFromDrive().then((fls) => {
                      setIsLoading(false);
                      return fls;
                    })
                  ).files.map((form) => ({
                    ...form,
                    selected: true,
                  })),
                );
              }}
              variant={isLoading ? "ghost" : "default"}
              size={isLoading ? "icon" : "default"}
            >
              {isLoading ? (
                <Loader2Icon className="size-6 animate-spin" />
              ) : (
                <>
                  <CircleArrowDownIcon className="size-4" />
                  Get Forms
                </>
              )}
            </Button>
          </div>
        ) : (
          <div>
            <div className="mb-2 flex items-center gap-4 px-4">
              <Checkbox
                checked={forms?.every((f) => f.selected)}
                onCheckedChange={() => {
                  setForms((fms) =>
                    fms?.map((fm) => ({
                      ...fm,
                      selected: !forms?.every((f) => f.selected),
                    })),
                  );
                }}
              />
              Select All
            </div>
            {forms?.map((form) => (
              <div
                className="grid cursor-pointer grid-cols-[min-content_1fr_min-content] items-center gap-4 rounded-md px-4 py-2 hover:bg-muted"
                onClick={() => {
                  setForms((fms) =>
                    fms?.map((fm) =>
                      fm.id === form.id
                        ? { ...fm, selected: !form.selected }
                        : fm,
                    ),
                  );
                }}
                key={form.id}
              >
                <Checkbox checked={form.selected} />
                <div>{form.name}</div>
                <Link
                  href={`https://docs.google.com/forms/d/${form.id}/edit`}
                  target="_blank"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-5",
                  )}
                >
                  <Link2Icon className="size-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
        <FooterRoot>
          <CloseContainer className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setForms(undefined)}>
              Cancel
            </Button>
            <Button
              variant="default"
              disabled={
                !forms ||
                forms.length === 0 ||
                isLoading ||
                forms.every((f) => !f.selected)
              }
              onClick={() => {
                if (!forms) return;
                toast.promise(importForms(forms?.filter((f) => f.selected)), {
                  loading: "Importing Forms",
                  success: "Forms Imported",
                  error: "Error Importing Forms",
                });
                setForms(undefined);
              }}
            >
              Import
            </Button>
          </CloseContainer>
        </FooterRoot>
      </>
    );
  };

  return (
    <ResponsiveDrawerDialog
      trigger={trigger}
      className="flex min-h-[30dvh] flex-col gap-4"
      title="Import Forms"
      description="Import forms from your Google Account"
      dialogContent={<Content type="dialog" />}
      drawerContent={<Content type="drawer" />}
    />
  );
}
