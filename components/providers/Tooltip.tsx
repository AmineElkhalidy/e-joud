import React, { Children } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  text: string;
  children: React.ReactNode;
}

const TooltipComponent = ({ text, children }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="mb-2">{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipComponent;
