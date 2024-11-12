"use client";

import { EllipsisVerticalIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { removeForms } from "~/server/db/models/form";

export function FormDropdownMenu({ formId }: { formId: string }) {
  return (
    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <EllipsisVerticalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>
                <Trash2Icon className="mr-2 size-4" />
                Remove
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to remove this form?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action does not delete the form from your Google account. It
              only removes it from this app.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({
                variant: "destructive",
              })}
              onClick={() => {
                toast.promise(
                  removeForms([formId]).then(() => window.location.reload()),
                  {
                    loading: "Removing Form",
                    success: "Form Removed",
                    error: "Error Removing Form",
                  },
                );
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
