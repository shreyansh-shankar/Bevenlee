import { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function CourseSection({
  title,
  description,
  action,
  children,
}: Props) {
  return (
    <section className="rounded-xl border bg-card p-6 flex flex-col gap-4">
      {/* ───── Header ───── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>

      {/* ───── Content ───── */}
      {children}
    </section>
  );
}
