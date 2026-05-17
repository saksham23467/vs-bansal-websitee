import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <div className="relative h-14 w-14 animate-pulse">
        <Image
          src="/ca-india-logo.png"
          alt=""
          width={56}
          height={56}
          className="h-full w-full object-contain"
          priority
        />
      </div>
      <p className="text-sm font-medium text-navy-500">Loading V S bansal & associates…</p>
    </div>
  );
}
