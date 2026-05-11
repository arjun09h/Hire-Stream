import { ActionButton } from "@/components/ActionButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/drizzle/db"
import { JobListingTable } from "@/drizzle/schema"
import {
  deleteJobListing,
  toggleJobListingFeatured,
  toggleJobListingStatus,
} from "@/features/jobListings/actions/actions"
import { JobListingBadges } from "@/features/jobListings/components/JobListingBadges"
import { formatJobListingStatus } from "@/features/jobListings/lib/formatters"
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth"
import { eq } from "drizzle-orm"
import { EditIcon, EyeIcon, PlusIcon, StarIcon, TrashIcon } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function EmployerDashboardPage() {
  const { orgId } = await getCurrentOrganization()
  if (orgId == null) redirect("/organizations/select")

  const jobListings = await db.query.JobListingTable.findMany({
    where: eq(JobListingTable.organizationId, orgId),
    orderBy: (table, { desc }) => [desc(table.updatedAt)],
  })

  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Job Listings
          </h1>
          <p className="text-muted-foreground">
            Manage postings, publishing, featured status, and applications.
          </p>
        </div>
        <Button asChild>
          <Link href="/employer/job-listings/new">
            <PlusIcon />
            New Listing
          </Link>
        </Button>
      </div>
      <div className="grid gap-4">
        {jobListings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No job listings yet.
            </CardContent>
          </Card>
        ) : (
          jobListings.map(jobListing => (
            <Card key={jobListing.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle>{jobListing.title}</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {formatJobListingStatus(jobListing.status)}
                      {jobListing.isFeatured ? " · Featured" : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/employer/job-listings/${jobListing.id}`}>
                        <EyeIcon />
                        View
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={`/employer/job-listings/${jobListing.id}/edit`}
                      >
                        <EditIcon />
                        Edit
                      </Link>
                    </Button>
                    <ActionButton
                      size="sm"
                      variant="outline"
                      action={toggleJobListingStatus.bind(null, jobListing.id)}
                    >
                      {jobListing.status === "published" ? "Delist" : "Publish"}
                    </ActionButton>
                    <ActionButton
                      size="sm"
                      variant="outline"
                      action={toggleJobListingFeatured.bind(null, jobListing.id)}
                    >
                      <StarIcon />
                      {jobListing.isFeatured ? "Unfeature" : "Feature"}
                    </ActionButton>
                    <ActionButton
                      size="sm"
                      variant="destructive"
                      action={deleteJobListing.bind(null, jobListing.id)}
                      requireAreYouSure
                    >
                      <TrashIcon />
                      Delete
                    </ActionButton>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <JobListingBadges jobListing={jobListing} />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
