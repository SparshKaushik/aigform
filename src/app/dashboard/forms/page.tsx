import {
  ALargeSmallIcon,
  CopyIcon,
  EllipsisVerticalIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function Dashboard() {

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-auto px-4 py-2 md:px-6">
      <h1 className="text-2xl font-bold">Forms</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        <Card>
          <img
            className="max-h-[30dvh] w-full rounded-xl"
            src="https://placehold.co/200x150"
            alt=""
          />
          <CardContent className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span>Card Content</span>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="size-8">
                  <UsersIcon className="size-4" />
                </Button>
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
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-4">
            <span className="text-xs text-muted-foreground">Opened</span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
