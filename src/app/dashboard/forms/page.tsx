import { eq, sql } from "drizzle-orm";
import {
  ALargeSmallIcon,
  CopyIcon,
  EllipsisVerticalIcon,
  ImportIcon,
  PlusIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { EmptyLottie } from "~/components/Lottie";
import { CustomPagination } from "~/components/Pagination";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { forms } from "~/server/db/schema";
import { ImportFormDialog } from "./components";
import { getForms } from "~/server/gapi/form";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const user = (await auth())?.user;
  if (!user?.id) {
    return <div>You are not logged in</div>;
  }
  const page = parseInt(searchParams.page ?? "1");
  const limit = parseInt(searchParams.limit ?? "10");

  const total =
    (
      await db
        .select({
          count: sql`count(*)`.mapWith(Number),
        })
        .from(forms)
        .where(eq(forms.createdById, user.id))
    )[0]?.count ?? 0;

  const frms = await db
    .select()
    .from(forms)
    .limit(limit)
    .offset((page - 1) * limit);

  const fullfrms = (await getForms(frms.map((f) => f.id))).filter((f) => f);

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-auto px-4 py-2 md:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Forms</h1>
        <div className="flex items-center gap-2">
          <Button variant="default" className="flex items-center gap-2">
            <PlusIcon className="size-4" />
            New Form
          </Button>
          <ImportFormDialog
            trigger={
              <Button variant="outline" className="flex items-center gap-2">
                <ImportIcon className="size-4" />
                Import Forms
              </Button>
            }
          />
        </div>
      </div>
      {frms.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <EmptyLottie className="max-h-[40dvh]" />
          <h2 className="text-lg font-medium">No forms found</h2>
          <div className="flex items-center gap-2">
            <Button variant="default" className="flex items-center gap-2">
              <PlusIcon className="size-4" />
              New Form
            </Button>
            <ImportFormDialog
              trigger={
                <Button variant="outline" className="flex items-center gap-2">
                  <ImportIcon className="size-4" />
                  Import Forms
                </Button>
              }
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {fullfrms.map((frm) => (
          <Link href={`/dashboard/forms/${frm.formId}`} key={frm.formId}>
            <Card>
              <img
                className="max-h-[30dvh] w-full rounded-xl"
                src="https://placehold.co/200x150"
                alt=""
              />
              <CardContent className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <span>
                    {!!frm.info.title ? frm.info.title : frm.info.documentTitle}
                  </span>
                  <div className="flex items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <ALargeSmallIcon className="mr-2 size-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CopyIcon className="mr-2 size-4" />
                          Make a Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash2Icon className="mr-2 size-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4">
                <span className="text-xs text-muted-foreground">
                  Last Edited -{" "}
                  {frms
                    .find((f) => f.id === frm.formId)
                    ?.updatedAt?.toLocaleString() ?? "Never"}
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      {Math.ceil(total / limit) > 1 && (
        <div className="grid grid-cols-[1fr_min-content]">
          <div />
          <CustomPagination
            totalRows={total}
            pageIndex={page}
            pageSize={limit}
          />
        </div>
      )}
    </div>
  );
}
