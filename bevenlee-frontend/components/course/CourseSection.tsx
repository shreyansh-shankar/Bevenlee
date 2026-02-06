import { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

export function CourseSection({ title, description, children }: Props) {
  return (
    <section className="rounded-xl border bg-card p-6 flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}
