'use client'

import * as React from 'react'
import { X, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface ClassificationTagsProps {
  tags: string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
}

export function ClassificationTags({ tags, onAddTag, onRemoveTag }: ClassificationTagsProps) {
  const [inputValue, setInputValue] = React.useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      onAddTag(inputValue.trim())
      setInputValue('')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="gap-1 border border-zinc-200 bg-zinc-50 py-1 pr-1 pl-3 text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            {tag}
            <button
              onClick={() => onRemoveTag(tag)}
              className="rounded-full p-0.5 transition-colors hover:bg-zinc-200"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="relative">
        <Input
          placeholder="Añadir etiqueta..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-9 text-sm"
        />
        <Plus className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
      </div>
    </div>
  )
}
