import { ReactNode } from "react"
import { JobSeekerShell } from "./_shared/JobSeekerShell"

export default function JobSeekerLayout({
  children,
  sidebar,
}: {
  children: ReactNode
  sidebar?: ReactNode
}) {
  return <JobSeekerShell sidebar={sidebar}>{children}</JobSeekerShell>
}
