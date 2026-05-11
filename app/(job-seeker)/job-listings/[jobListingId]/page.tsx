import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer"
import { db } from "@/drizzle/db"
import { JobListingTable } from "@/drizzle/schema"
import { JobListingBadges } from "@/features/jobListings/components/JobListingBadges"
import { NewJobListingApplicationForm } from "@/features/jobListingApplications/components/NewJobListingApplicationForm"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth"
import { and, eq } from "drizzle-orm"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function JobListingPage({
  params,
}: {
  params: Promise<{ jobListingId: string }>
}) {
  const { jobListingId } = await params
  const [jobListing, { userId }] = await Promise.all([
    getJobListing(jobListingId),
    getCurrentUser(),
  ])

  if (jobListing == null) notFound()

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 p-4 md:grid-cols-[1fr_360px] md:p-6">
      <main className="space-y-6">
        <div>
          <p className="text-muted-foreground text-sm">
            {jobListing.organization.name}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            {jobListing.title}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <JobListingBadges jobListing={jobListing} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer source={jobListing.description} />
          </CardContent>
        </Card>
      </main>
      <aside>
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Apply</CardTitle>
          </CardHeader>
          <CardContent>
            {userId == null ? (
              <Button asChild className="w-full">
                <Link href="/sign-in">Sign In To Apply</Link>
              </Button>
            ) : (
              <NewJobListingApplicationForm jobListingId={jobListing.id} />
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}

function getJobListing(id: string) {
  return db.query.JobListingTable.findFirst({
    where: and(eq(JobListingTable.id, id), eq(JobListingTable.status, "published")),
    with: {
      organization: {
        columns: {
          name: true,
        },
      },
    },
  })
}
