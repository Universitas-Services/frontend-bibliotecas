import { Info } from 'lucide-react'

type FeatureUnavailableBannerProps = {
  title: string
  description: string
}

export function FeatureUnavailableBanner({ title, description }: FeatureUnavailableBannerProps) {
  return (
    <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950">
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-sm text-amber-900/90">{description}</p>
      </div>
    </div>
  )
}
