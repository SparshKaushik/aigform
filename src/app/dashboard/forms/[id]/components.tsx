"use client";

import type { Form } from "~/server/db/models/form.type";

export function Form({ form }: { form: Form }) {
  return (
    <div className="flex flex-col gap-4 px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {!!form.info.title ? form.info.title : form.info.documentTitle}
        </h1>
      </div>
      <div className="grid w-full grid-cols-2">
        <div className="flex flex-col gap-4">
          {form.items?.map((item) => <div key={item.itemId}>{item.title}</div>)}
        </div>
      </div>
    </div>
  );
}
