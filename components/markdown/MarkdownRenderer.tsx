import { cn } from "@/lib/utils"
import { markdownClassNames } from "./markdownStyles"

export function MarkdownRenderer({
  className,
  source,
}: {
  className?: string
  source: string
}) {
  return (
    <div className={cn(markdownClassNames, className)}>
      <div className="whitespace-pre-wrap break-words">{source}</div>
    </div>
  )
}
