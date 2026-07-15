import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-heading text-xl font-bold tracking-tight",
        className,
      )}
    >
      <span className="from-brand-green to-brand-leaf text-primary-foreground flex size-8 items-center justify-center rounded-full bg-gradient-to-br shadow-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-4.5"
        >
          <path
            d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="4" fill="currentColor" />
        </svg>
      </span>
      <span>
        Watt<span className="text-brand-sun">Pe</span>
      </span>
    </span>
  );
}
