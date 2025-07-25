import { LayoutProvider } from "@/context/LayoutContext";
import Sidebar from "@/components/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <LayoutProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="ml-64 flex-1 p-8 pt-[80px] pb-[64px]">{children}</main>
      </div>
    </LayoutProvider>
  );
}
