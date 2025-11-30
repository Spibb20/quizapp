import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarProvider,
  SidebarHeader,
} from "../../components/ui/sidebar";

export function AppSidebar() {
  return (
    <div className="flex h-screen w-[15%]">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="flex justify-center items-center">
            <p className="font-bold">Quiz app</p>
          </SidebarHeader>
          <SidebarContent />
        </Sidebar>
        <SidebarTrigger></SidebarTrigger>
      </SidebarProvider>
    </div>
  );
}
