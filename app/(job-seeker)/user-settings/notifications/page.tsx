import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/drizzle/db"
import { UserNotificationSettingsTable } from "@/drizzle/schema"
import { NotificationsForm } from "@/features/users/components/NotificationsForm"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"

export default async function UserNotificationSettingsPage() {
  const { userId } = await getCurrentUser()
  if (userId == null) redirect("/sign-in")

  const notificationSettings =
    await db.query.UserNotificationSettingsTable.findFirst({
      where: eq(UserNotificationSettingsTable.userId, userId),
      columns: {
        newJobEmailNotifications: true,
        aiPrompt: true,
      },
    })

  return (
    <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Notification Settings
        </h1>
        <p className="text-muted-foreground">
          Manage daily job listing emails and AI filtering.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Job Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationsForm notificationSettings={notificationSettings} />
        </CardContent>
      </Card>
    </div>
  )
}
