import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/drizzle/db"
import {
  experienceLevels,
  JobListingTable,
  jobListingTypes,
  locationRequirements,
} from "@/drizzle/schema"
import { JobListingBadges } from "@/features/jobListings/components/JobListingBadges"
import { and, eq, ilike, inArray } from "drizzle-orm"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type JobListingSearchParams = Record<string, string | string[]>

export async function JobListingItems({
  searchParams,
}: {
  searchParams: Promise<JobListingSearchParams>
}) {
  const params = await searchParams
  const jobListings = await getJobListings(params)

  if (jobListings.length === 0) {
    return (
      <p className="text-muted-foreground py-12 text-center">
        No job listings found.
      </p>
    )
  }

  return (
    <div className="grid gap-4">
      {jobListings.map(jobListing => (
        <Card key={jobListing.id}>
          <CardHeader>
            <CardTitle>{jobListing.title}</CardTitle>
            <p className="text-muted-foreground text-sm">
              {jobListing.organization.name}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <JobListingBadges jobListing={jobListing} />
            </div>
            <p className="text-muted-foreground line-clamp-3 text-sm">
              {jobListing.description}
            </p>
            <Button asChild>
              <Link href={`/job-listings/${jobListing.id}`}>View Job</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function getJobListings(params: JobListingSearchParams) {
  const jobIds = getParamValues(params.jobIds)
  const title = getParamValue(params.title)
  const city = getParamValue(params.city)
  const stateAbbreviation = getParamValue(params.state)
  const experienceLevel = getEnumParamValue(
    params.experience,
    experienceLevels
  )
  const type = getEnumParamValue(params.type, jobListingTypes)
  const locationRequirement = getEnumParamValue(
    params.locationRequirement,
    locationRequirements
  )

  const filters = [
    eq(JobListingTable.status, "published"),
    jobIds.length > 0 ? inArray(JobListingTable.id, jobIds) : undefined,
    title != null ? ilike(JobListingTable.title, `%${title}%`) : undefined,
    city != null ? ilike(JobListingTable.city, `%${city}%`) : undefined,
    stateAbbreviation != null
      ? eq(JobListingTable.stateAbbreviation, stateAbbreviation)
      : undefined,
    experienceLevel != null
      ? eq(JobListingTable.experienceLevel, experienceLevel)
      : undefined,
    type != null ? eq(JobListingTable.type, type) : undefined,
    locationRequirement != null
      ? eq(JobListingTable.locationRequirement, locationRequirement)
      : undefined,
  ].filter(filter => filter != null)

  return db.query.JobListingTable.findMany({
    where: and(...filters),
    with: {
      organization: {
        columns: {
          name: true,
        },
      },
    },
    orderBy: (table, { desc }) => [desc(table.isFeatured), desc(table.postedAt)],
  })
}

function getParamValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0]
  return value
}

function getParamValues(value: string | string[] | undefined) {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

function getEnumParamValue<T extends readonly string[]>(
  value: string | string[] | undefined,
  allowedValues: T
): T[number] | undefined {
  const paramValue = getParamValue(value)

  if (paramValue != null && allowedValues.includes(paramValue)) {
    return paramValue
  }
}
