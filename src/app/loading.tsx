import { BrandMark } from "@/components/layout/brand-mark";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-navy-200 border-t-royal-600" />
        <BrandMark size={40} className="relative z-10" />
      </div>
      <p className="text-sm font-medium text-navy-500">Loading VS Bansal & Associates…</p>
    </div>
  );
}
