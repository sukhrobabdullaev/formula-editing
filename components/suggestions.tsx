"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Folder, Hash, Percent } from "lucide-react"

interface SuggestionsProps {
  suggestions: any[]
  onSelect: (suggestion: any) => void
  inputRef: React.RefObject<HTMLInputElement>
}

export function Suggestions({ suggestions, onSelect, inputRef }: SuggestionsProps) {
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Position the suggestions dropdown
  useEffect(() => {
    if (suggestionsRef.current && inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect()
      suggestionsRef.current.style.top = `${inputRect.height + 5}px`
      suggestionsRef.current.style.left = "0"
    }
  }, [inputRef])

  const getIconForCategory = (category: string) => {
    if (category.toLowerCase().includes("sales")) {
      return <Hash className="w-4 h-4 mr-2 text-blue-500" />
    } else if (category.toLowerCase().includes("inbound")) {
      return <Folder className="w-4 h-4 mr-2 text-purple-500" />
    } else {
      return <Percent className="w-4 h-4 mr-2 text-green-500" />
    }
  }

  return (
    <div
      ref={suggestionsRef}
      className="absolute z-10 w-72 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg"
      style={{ top: "100%", left: "0" }}
    >
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
          onClick={() => onSelect(suggestion)}
        >
          <div className="flex items-center">
            {suggestion.category.toLowerCase().includes("inbound") ? (
              <Hash className="w-5 h-5 mr-2 text-blue-500" />
            ) : (
              <Percent className="w-5 h-5 mr-2 text-purple-500" />
            )}
          </div>
          <div>
            <div className="font-medium text-gray-800">{suggestion.name}</div>
            <div className="text-xs text-gray-500 flex items-center mt-1">
              <span className="mr-1">•</span> {suggestion.category}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
