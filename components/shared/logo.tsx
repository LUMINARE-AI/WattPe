import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-heading text-xl font-bold tracking-tight",
        className,
      )}
    >
      <span className="from-brand-green to-brand-green-hover relative flex size-8 items-center justify-center rounded-[10px] bg-gradient-to-br text-sm font-extrabold tracking-tighter text-white shadow-sm">
        Wp
        <span className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-white shadow-[0_0_0_2px_rgba(255,255,255,1)]">
          <svg viewBox="0 0 24 24" fill="none" className="size-2">
            <path
              d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"
              stroke="var(--brand-void)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="3.5" fill="var(--brand-void)" />
          </svg>
        </span>
      </span>
      <span>
        Watt<span className="text-brand-sun">Pe</span>
      </span>
    </span>
  );
}
