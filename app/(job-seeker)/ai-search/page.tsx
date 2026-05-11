import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { JobListingAiSearchForm } from "@/features/jobListings/components/JobListingAiSearchForm"

export default function AiSearchPage() {
  return (
    <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">AI Search</h1>
        <p className="text-muted-foreground">
          Describe the kind of role you want and get matching published jobs.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Search Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <JobListingAiSearchForm />
        </CardContent>
      </Card>
    </div>
  )
}
