import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer"
import { Button } from "@/components/ui/button"
import { db } from "@/drizzle/db"
import { UserResumeTable } from "@/drizzle/schema"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth"
import { UploadDropzone } from "@/services/uploadthing/components/UploadThing"
import { UploadThingSSR } from "@/services/uploadthing/components/UploadThingSSR"
import { eq } from "drizzle-orm"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function ResumeSettingsPage() {
  const { userId } = await getCurrentUser()
  if (userId == null) redirect("/sign-in")

  const resume = await db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
  })

  return (
    <div className="mx-auto w-full max-w-4xl p-4 md:p-6">
      <UploadThingSSR />
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Resume</h1>
        <p className="text-muted-foreground">
          Upload the resume used for job applications and AI matching.
        </p>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <UploadDropzone endpoint="resumeUploader" />
          </CardContent>
        </Card>
        {resume != null && (
          <Card>
            <CardHeader>
              <CardTitle>Current Resume</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="outline">
                <Link href={resume.resumeFileUrl} target="_blank">
                  Open Original Resume
                </Link>
              </Button>
              {resume.aiSummary != null && (
                <MarkdownRenderer source={resume.aiSummary} />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
