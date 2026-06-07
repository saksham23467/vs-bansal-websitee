"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useCareers } from "@/components/careers/careers-provider";

type ApplyButtonProps = ButtonProps & {
  positionTitle?: string;
};

export function ApplyButton({ positionTitle, children, ...props }: ApplyButtonProps) {
  const { openApply } = useCareers();
  return (
    <Button type="button" onClick={() => openApply(positionTitle)} {...props}>
      {children ?? "Apply Now"}
    </Button>
  );
}
