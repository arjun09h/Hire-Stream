import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/drizzle/db"
import { OrganizationUserSettingsTable } from "@/drizzle/schema"
import { NotificationsForm } from "@/features/organizations/components/NotificationsForm"
import {
  getCurrentOrganization,
  getCurrentUser,
} from "@/services/clerk/lib/getCurrentAuth"
import { and, eq } from "drizzle-orm"
import { redirect } from "next/navigation"

export default async function EmployerUserSettingsPage() {
  const [{ userId }, { orgId }] = await Promise.all([
    getCurrentUser(),
    getCurrentOrganization(),
  ])

  if (userId == null) redirect("/sign-in")
  if (orgId == null) redirect("/organizations/select")

  const notificationSettings =
    await db.query.OrganizationUserSettingsTable.findFirst({
      where: and(
        eq(OrganizationUserSettingsTable.userId, userId),
        eq(OrganizationUserSettingsTable.organizationId, orgId)
      ),
      columns: {
        newApplicationEmailNotifications: true,
        minimumRating: true,
      },
    })

  return (
    <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Employer Notifications
        </h1>
        <p className="text-muted-foreground">
          Configure application summary emails for your active organization.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Application Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationsForm notificationSettings={notificationSettings} />
        </CardContent>
      </Card>
    </div>
  )
}
