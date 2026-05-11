import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/drizzle/db"
import { JobListingTable } from "@/drizzle/schema"
import { JobListingForm } from "@/features/jobListings/components/JobListingForm"
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth"
import { and, eq } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"

export default async function EditJobListingPage({
  params,
}: {
  params: Promise<{ jobListingId: string }>
}) {
  const [{ jobListingId }, { orgId }] = await Promise.all([
    params,
    getCurrentOrganization(),
  ])
  if (orgId == null) redirect("/organizations/select")

  const jobListing = await db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, jobListingId),
      eq(JobListingTable.organizationId, orgId)
    ),
  })

  if (jobListing == null) notFound()

  return (
    <div className="mx-auto w-full max-w-4xl p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit Job Listing
        </h1>
        <p className="text-muted-foreground">{jobListing.title}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Listing Details</CardTitle>
        </CardHeader>
        <CardContent>
          <JobListingForm jobListing={jobListing} />
        </CardContent>
      </Card>
    </div>
  )
}
