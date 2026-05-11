"use client"

import { ReactNode, Suspense } from "react"
import { useAuth } from "@clerk/nextjs"

export function SignedOut({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <SignedOutContent>{children}</SignedOutContent>
    </Suspense>
  )
}

export function SignedIn({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <SignedInContent>{children}</SignedInContent>
    </Suspense>
  )
}

function SignedOutContent({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded || isSignedIn) return null

  return children
}

function SignedInContent({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded || !isSignedIn) return null

  return children
}
