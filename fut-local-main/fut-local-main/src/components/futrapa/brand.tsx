import { Link } from "@tanstack/react-router";

import logo from "@/assets/futrapa-logo.png";
import { cn } from "@/lib/utils";

export function Brand({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)}>
      <img
        src={logo}
        alt="FutRapa"
        width={36}
        height={36}
        className="h-9 w-9 drop-shadow-[0_0_12px_oklch(0.78_0.21_148_/_0.55)]"
      />
      {!compact && (
        <span className="font-display text-xl font-bold tracking-tight">
          Fut<span className="text-gradient-pitch">Rapa</span>
        </span>
      )}
    </Link>
  );
}
