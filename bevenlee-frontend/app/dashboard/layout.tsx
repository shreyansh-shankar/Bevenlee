import { Navbar } from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* PAGE CONTENT */}
      <div className="mx-auto max-w-7xl px-5 py-10">
        {children}
      </div>
    </main>
  );
}
