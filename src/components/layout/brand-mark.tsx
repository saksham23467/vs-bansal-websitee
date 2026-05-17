import Image from "next/image";
import { cn } from "@/lib/utils";

export const CA_INDIA_LOGO_PATH = "/ca-india-logo.png";

export function BrandMark({
  className,
  size = 44,
  priority = false,
}: {
  className?: string;
  size?: number;
  priority?: boolean;
}) {
  return (
    <Image
      src={CA_INDIA_LOGO_PATH}
      alt="CA India"
      width={size}
      height={size}
      priority={priority}
      className={cn("h-auto w-auto object-contain", className)}
      style={{ width: size, height: "auto", maxHeight: size }}
    />
  );
}
