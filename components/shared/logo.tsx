import { cn } from "@/lib/utils";

export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center",
        onDark && "rounded-lg bg-white px-2.5 py-1.5",
        className,
      )}
    >
      {/* Native img avoids Next/Image width collapse with w-auto in flex layouts */}
      <img
        src={onDark ? "/logo.png" : "/logo-transparent.png"}
        alt="WattPe"
        width={1774}
        height={887}
        className="block h-14 w-auto max-w-none object-contain"
        style={{ height: "3.5rem", width: "auto" }}
      />
    </span>
  );
}
