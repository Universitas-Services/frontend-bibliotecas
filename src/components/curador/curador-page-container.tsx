import { CuradorTabs } from "./curador-tabs"

interface CuradorPageContainerProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function CuradorPageContainer({
  title,
  description,
  children,
}: CuradorPageContainerProps) {
  return (
    <div className="flex flex-col min-h-full">
      <div className="px-8 pt-8 pb-0 bg-white">
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-medium text-zinc-900">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <CuradorTabs />
      </div>
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  )
}
