import { JobListingItems } from "./(job-seeker)/_shared/JobListingItems"
import { JobSeekerShell } from "./(job-seeker)/_shared/JobSeekerShell"

export default function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>
}) {
  return (
    <JobSeekerShell>
      <div className="mx-auto w-full max-w-5xl p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Job Board</h1>
          <p className="text-muted-foreground">
            Browse published roles and apply with your saved resume.
          </p>
        </div>
        <JobListingItems searchParams={searchParams} />
      </div>
    </JobSeekerShell>
  )
}
