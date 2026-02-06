import { ReactNode } from "react";

export function CourseLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-10">
      {children}
    </div>
  );
}
