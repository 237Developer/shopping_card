import { Sidebar } from "@/components/dashboard/home/Sidebar";
import { Header } from "@/components/dashboard/home/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F9FD]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
