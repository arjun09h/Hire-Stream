import { AppSidebar } from "@/components/sidebar/AppSidebar"
import { SidebarNavMenuGroup } from "@/components/sidebar/SidebarNavMenuGroup"
import { SidebarOrganizationButton } from "@/features/organizations/components/SidebarOrganizationButton"
import {
  BellIcon,
  BriefcaseBusinessIcon,
  CreditCardIcon,
  PlusIcon,
} from "lucide-react"
import { ReactNode } from "react"

export default function EmployerLayout({ children }: { children: ReactNode }) {
  return (
    <AppSidebar
      content={
        <SidebarNavMenuGroup
          items={[
            {
              href: "/employer",
              icon: <BriefcaseBusinessIcon />,
              label: "Job Listings",
            },
            {
              href: "/employer/job-listings/new",
              icon: <PlusIcon />,
              label: "New Listing",
            },
            {
              href: "/employer/user-settings",
              icon: <BellIcon />,
              label: "Notifications",
            },
            {
              href: "/employer/pricing",
              icon: <CreditCardIcon />,
              label: "Pricing",
            },
          ]}
        />
      }
      footerButton={<SidebarOrganizationButton />}
    >
      {children}
    </AppSidebar>
  )
}
