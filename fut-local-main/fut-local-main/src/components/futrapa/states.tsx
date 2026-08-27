import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="flex flex-col items-center gap-3 border-dashed border-border/80 bg-card/60 px-6 py-14 text-center">
      <div className="rounded-full bg-secondary p-4">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action}
    </Card>
  );
}

export function ErrorState({ message }: { message?: string }) {
  return (
    <Card className="border-destructive/40 bg-destructive/10 p-6 text-center">
      <p className="font-medium">Não conseguimos carregar essas informações.</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {message ?? "Verifique sua conexão e tente novamente em instantes."}
      </p>
    </Card>
  );
}

export function CardSkeletonGrid({ count = 6, height = 300 }: { count?: number; height?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="w-full rounded-xl" style={{ height }} />
      ))}
    </div>
  );
}
