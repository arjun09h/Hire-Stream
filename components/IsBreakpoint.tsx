"use client"

import { ReactNode, useSyncExternalStore } from "react"

export function IsBreakpoint({
  breakpoint,
  children,
  otherwise,
}: {
  breakpoint: string
  children: ReactNode
  otherwise?: ReactNode
}) {
  const IsBreakpoint = useIsBreakpoint(breakpoint)
  return IsBreakpoint ? children : otherwise
}

function useIsBreakpoint(breakpoint: string) {
  return useSyncExternalStore(
    onStoreChange => {
      const controller = new AbortController()
      const media = window.matchMedia(`(${breakpoint})`)
      media.addEventListener("change", onStoreChange, {
        signal: controller.signal,
      })

      return () => {
        controller.abort()
      }
    },
    () => window.matchMedia(`(${breakpoint})`).matches,
    () => false
  )
}
