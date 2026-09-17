import DashboardLocaleSwitcher from "@/components/layouts/dashboard-locale-switcher";
import DashboardSidebar from "@/components/layouts/dashboard-sidebar";
import DashboardUserButton from "@/components/layouts/dashboard-user-button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" />
          <div className="ms-auto flex items-center gap-1">
            <DashboardLocaleSwitcher />
            <DashboardUserButton />
          </div>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
export default Layout;
