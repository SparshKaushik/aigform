import { TrendingUpIcon } from "lucide-react";
import { ResponsiveElement } from "~/components/Common";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export default function Dashboard() {
  return (
    <div className="flex-1 overflow-auto p-4">
      <Card className="space-y-2">
        <CardHeader>
          <CardTitle className="text-lg">Overview</CardTitle>
          <CardDescription className="text-sm">
            Visualize your main activities data
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 md:flex-row">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold leading-none text-muted-foreground">
                Total Forms
              </h3>
              <span className="text-xl">0</span>
            </div>
            <Badge variant="secondary" className="gap-2">
              <TrendingUpIcon className="size-4" />
              50%
            </Badge>
          </div>
          <ResponsiveElement
            desktopElement={<Separator orientation="vertical" />}
            mobileElement={<Separator orientation="horizontal" />}
          />
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold leading-none text-muted-foreground">
                Total Forms
              </h3>
              <span className="text-xl">0</span>
            </div>
            <Badge variant="secondary" className="gap-2">
              <TrendingUpIcon className="size-4" />
              50%
            </Badge>
          </div>
          <ResponsiveElement
            desktopElement={<Separator orientation="vertical" />}
            mobileElement={<Separator orientation="horizontal" />}
          />
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold leading-none text-muted-foreground">
                Total Forms
              </h3>
              <span className="text-xl">0</span>
            </div>
            <Badge variant="secondary" className="gap-2">
              <TrendingUpIcon className="size-4" />
              50%
            </Badge>
          </div>
          <ResponsiveElement
            desktopElement={<Separator orientation="vertical" />}
            mobileElement={<Separator orientation="horizontal" />}
          />
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold leading-none text-muted-foreground">
                Total Forms
              </h3>
              <span className="text-xl">0</span>
            </div>
            <Badge variant="secondary" className="gap-2">
              <TrendingUpIcon className="size-4" />
              50%
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
