import { ActionButton } from "@/components/ActionButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer"
import { db } from "@/drizzle/db"
import { JobListingApplicationTable, JobListingTable } from "@/drizzle/schema"
import {
  deleteJobListing,
  toggleJobListingFeatured,
  toggleJobListingStatus,
} from "@/features/jobListings/actions/actions"
import { JobListingBadges } from "@/features/jobListings/components/JobListingBadges"
import {
  formatJobListingStatus,
  formatJobListingLocation,
} from "@/features/jobListings/lib/formatters"
import { ApplicationTable } from "@/features/jobListingApplications/components/ApplicationTable"
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUserPermissions"
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth"
import { and, eq } from "drizzle-orm"
import { EditIcon, StarIcon, TrashIcon } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

export default async function EmployerJobListingPage({
  params,
}: {
  params: Promise<{ jobListingId: string }>
}) {
  const [{ jobListingId }, { orgId }, canUpdateRating, canUpdateStage] =
    await Promise.all([
      params,
      getCurrentOrganization(),
      hasOrgUserPermission("org:job_listing_applications:change_rating"),
      hasOrgUserPermission("org:job_listing_applications:change_stage"),
    ])

  if (orgId == null) redirect("/organizations/select")

  const [jobListing, applications] = await Promise.all([
    db.query.JobListingTable.findFirst({
      where: and(
        eq(JobListingTable.id, jobListingId),
        eq(JobListingTable.organizationId, orgId)
      ),
    }),
    db.query.JobListingApplicationTable.findMany({
      where: eq(JobListingApplicationTable.jobListingId, jobListingId),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            imageUrl: true,
          },
          with: {
            resume: {
              columns: {
                resumeFileUrl: true,
                aiSummary: true,
              },
            },
          },
        },
      },
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    }),
  ])

  if (jobListing == null) notFound()

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-sm">
            {formatJobListingStatus(jobListing.status)}
            {jobListing.postedAt
              ? ` · Posted ${jobListing.postedAt.toLocaleDateString()}`
              : ""}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            {jobListing.title}
          </h1>
          <p className="text-muted-foreground">
            {formatJobListingLocation(jobListing)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={`/employer/job-listings/${jobListing.id}/edit`}>
              <EditIcon />
              Edit
            </Link>
          </Button>
          <ActionButton
            variant="outline"
            action={toggleJobListingStatus.bind(null, jobListing.id)}
          >
            {jobListing.status === "published" ? "Delist" : "Publish"}
          </ActionButton>
          <ActionButton
            variant="outline"
            action={toggleJobListingFeatured.bind(null, jobListing.id)}
          >
            <StarIcon />
            {jobListing.isFeatured ? "Unfeature" : "Feature"}
          </ActionButton>
          <ActionButton
            variant="destructive"
            action={deleteJobListing.bind(null, jobListing.id)}
            requireAreYouSure
          >
            <TrashIcon />
            Delete
          </ActionButton>
        </div>
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
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicationTable
            applications={applications.map(application => ({
              createdAt: application.createdAt,
              stage: application.stage,
              rating: application.rating,
              jobListingId: application.jobListingId,
              coverLetterMarkdown: application.coverLetter ? (
                <MarkdownRenderer source={application.coverLetter} />
              ) : null,
              user: {
                ...application.user,
                resume: application.user.resume
                  ? {
                      resumeFileUrl: application.user.resume.resumeFileUrl,
                      markdownSummary: application.user.resume.aiSummary ? (
                        <MarkdownRenderer
                          source={application.user.resume.aiSummary}
                        />
                      ) : null,
                    }
                  : null,
              },
            }))}
            canUpdateRating={canUpdateRating}
            canUpdateStage={canUpdateStage}
          />
        </CardContent>
      </Card>
    </div>
  )
}
