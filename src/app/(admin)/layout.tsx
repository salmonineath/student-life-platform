import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip"; // ← add this
import { AdminAppSideBar } from "./components/AdminAppSideBar";
// import AdminHeader from "./components/adminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      {" "}
      {/* ← wrap everything */}
      <SidebarProvider>
        <AdminAppSideBar />
        <SidebarInset className="flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 flex-shrink-0 bg-white border-b flex items-center px-6">
            <SidebarTrigger />
            {/* <AdminHeader /> */}
          </header>
          <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
