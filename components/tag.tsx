"use client"

import { useState, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { TagDropdown } from "@/components/tag-dropdown"

interface TagProps {
  tag: {
    id: string
    name: string
    category: string
    value: number
    timePeriod?: string
  }
  onRemove: () => void
}

export function Tag({ tag, onRemove }: TagProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const tagRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative" ref={tagRef}>
      <div className="flex items-center">
        <div
          className="flex items-center bg-blue-100 text-blue-700 rounded-full px-3 py-1 mx-1 my-0.5 text-sm"
          onClick={(e) => {
            e.stopPropagation()
            setShowDropdown(!showDropdown)
          }}
        >
          <span className="mr-1 text-blue-500">#</span>
          <span>{tag.name}</span>
          <ChevronDown className="ml-1 w-4 h-4" />
        </div>

        {tag.timePeriod && (
          <div className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 mx-1 my-0.5 text-sm">{tag.timePeriod}</div>
        )}
      </div>

      {showDropdown && <TagDropdown tag={tag} onClose={() => setShowDropdown(false)} parentRef={tagRef} />}
    </div>
  )
}

