import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { AppSidebarClient } from "./_AppSidebarClient";

export default function Home() {
  return <SidebarProvider className="overflow-y-hidden">
    <AppSidebarClient>

    <Sidebar collapsible="icon" className="overflow-hidden">
      <SidebarHeader className="flex-row">
        <SidebarTrigger />
        <span className="text-xl text-nowrap text">HireStream</span>
      </SidebarHeader>
      <SidebarContent>
        abc
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton> Open </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    <main className="flex-1">Hi</main>
    
    </AppSidebarClient>
  </SidebarProvider>
}
