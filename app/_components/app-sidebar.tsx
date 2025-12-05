import { title } from "process";
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarProvider,
  SidebarHeader,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../../components/ui/sidebar";

export function AppSidebar() {
  const GetTitle = async () => {};
  return (
    <div className="flex h-screen w-[15%]">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="flex justify-center items-center">
            <p className="font-bold">Quiz app</p>
            <SidebarMenu>
              <SidebarMenuButton></SidebarMenuButton>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent />
        </Sidebar>
        <SidebarTrigger onClick={GetTitle}></SidebarTrigger>
      </SidebarProvider>
    </div>
  );
}
