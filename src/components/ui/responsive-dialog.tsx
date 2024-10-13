import { useMediaQuery } from "~/lib/utils.client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import { useState } from "react";
import { cn } from "~/lib/utils";

interface ResponsiveDrawerDialogProps {
  trigger: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  dialogContent: React.ReactNode;
  drawerContent: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ResponsiveDrawerDialog(props: ResponsiveDrawerDialogProps) {
  const [open, setOpen] = useState(false);

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    props.onOpenChange?.(open);
  };

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const RenderTDsc = ({ type }: { type: "dialog" | "drawer" }) => {
    if (props.title === undefined && props.description === undefined) {
      return null;
    }
    const Header = type === "dialog" ? DialogHeader : DrawerHeader;
    const Title = type === "dialog" ? DialogTitle : DrawerTitle;
    const Description =
      type === "dialog" ? DialogDescription : DrawerDescription;

    return (
      <Header className="text-left">
        <Title>{props.title}</Title>
        <Description>{props.description}</Description>
      </Header>
    );
  };

  if (isDesktop) {
    return (
      <Dialog open={props.open ?? open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{props.trigger}</DialogTrigger>
        <DialogContent className={cn("bg-popover", props.className)}>
          <RenderTDsc type="dialog" />
          {props.dialogContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={props.open ?? open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{props.trigger}</DrawerTrigger>
      <DrawerContent className={cn("bg-popover", props.className)}>
        <RenderTDsc type="drawer" />
        {props.drawerContent}
      </DrawerContent>
    </Drawer>
  );
}
