import { eq, sql } from "drizzle-orm";
import { ImportIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { EmptyLottie } from "~/components/Lottie";
import { CustomPagination } from "~/components/Pagination";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { forms } from "~/server/db/schema";
import { CreateFormButton, FormDropdownMenu, ImportFormDialog } from "./components";
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
  // const page = parseInt(searchParams.page ?? "1");
  // const limit = parseInt(searchParams.limit ?? "10");

  // const total =
  //   (
  //     await db
  //       .select({
  //         count: sql`count(*)`.mapWith(Number),
  //       })
  //       .from(forms)
  //       .where(eq(forms.createdById, user.id))
  //   )[0]?.count ?? 0;

  const frms = await db
    .select()
    .from(forms)
    .where(eq(forms.createdById, user.id));
  // .limit(limit)
  // .offset((page - 1) * limit);

  const fullfrms = (await getForms(frms.map((f) => f.id))).filter((f) => f);

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-auto px-4 py-2 md:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Forms</h1>
        <div className="flex items-center gap-2">
          <CreateFormButton />
          <ImportFormDialog
            trigger={
              <Button variant="outline" className="flex items-center gap-2">
                <ImportIcon className="size-4" />
                Import Forms
              </Button>
            }
            existingForms={frms.map((f) => f.id)}
          />
        </div>
      </div>
      {frms.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <EmptyLottie className="max-h-[40dvh]" />
          <h2 className="text-lg font-medium">No forms found</h2>
          <div className="flex items-center gap-2">
            <CreateFormButton />
            <ImportFormDialog
              trigger={
                <Button variant="outline" className="flex items-center gap-2">
                  <ImportIcon className="size-4" />
                  Import Forms
                </Button>
              }
              existingForms={frms.map((f) => f.id)}
            />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {fullfrms.map((frm) => (
          <Link href={`/dashboard/forms/${frm.formId}`} key={frm.formId}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg">
                    {!!frm.info.title ? frm.info.title : frm.info.documentTitle}
                  </span>
                  <FormDropdownMenu formId={frm.formId} />
                </div>
                <span className="text-sm text-muted-foreground">
                  Last Edited -{" "}
                  {frms
                    .find((f) => f.id === frm.formId)
                    ?.updatedAt?.toLocaleString() ?? "Never"}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {/* {Math.ceil(total / limit) > 1 && (
        <div className="grid grid-cols-[1fr_min-content]">
          <div />
          <CustomPagination
            totalRows={total}
            pageIndex={page}
            pageSize={limit}
          />
        </div>
      )} */}
    </div>
  );
}
