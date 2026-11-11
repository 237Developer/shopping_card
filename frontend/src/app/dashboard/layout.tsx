import { Sidebar } from "@/components/dashboard/home/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { getCurrentUser } from "@/lib/dashboard/auth";
import { Suspense } from "react";

async function HeaderWrapper() {
  const user = await getCurrentUser();
  return <Header user={user} />;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F9FD]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Suspense fallback={<div className="h-20 bg-white border-b border-slate-200" />}>
          <HeaderWrapper />
        </Suspense>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
