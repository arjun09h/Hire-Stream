import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { JobListingForm } from "@/features/jobListings/components/JobListingForm"

export default function NewJobListingPage() {
  return (
    <div className="mx-auto w-full max-w-4xl p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          New Job Listing
        </h1>
        <p className="text-muted-foreground">
          Create a draft listing, then publish it from the dashboard.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Listing Details</CardTitle>
        </CardHeader>
        <CardContent>
          <JobListingForm jobListing={undefined} />
        </CardContent>
      </Card>
    </div>
  )
}
