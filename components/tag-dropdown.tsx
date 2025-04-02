"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Calendar, Clock, Info } from "lucide-react"
import { useFormulaStore } from "@/store/formula-store"

interface TagDropdownProps {
  tag: {
    id: string
    name: string
    category: string
    value: number
    timePeriod?: string
  }
  onClose: () => void
  parentRef: React.RefObject<HTMLDivElement>
}

export function TagDropdown({ tag, onClose, parentRef }: TagDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { updateTagTimePeriod } = useFormulaStore()
  const [activeSection, setActiveSection] = useState<"single" | "span">("single")

  // Position the dropdown relative to the tag
  useEffect(() => {
    if (dropdownRef.current && parentRef.current) {
      const tagRect = parentRef.current.getBoundingClientRect()
      dropdownRef.current.style.top = `${tagRect.height + 5}px`
      dropdownRef.current.style.left = "0"
    }
  }, [parentRef])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        parentRef.current &&
        !parentRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose, parentRef])

  const handleSelectTimePeriod = (period: string) => {
    updateTagTimePeriod(tag.id, period)
    onClose()
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute z-10 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-0 overflow-hidden"
    >
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-800">{tag.name}</h3>
          <span className="text-xs text-gray-500">{tag.category}</span>
        </div>

        <div className="pt-1">
          <div className="flex items-center text-sm text-gray-600">
            <Info className="w-4 h-4 mr-2" />
            <span>Current value: {tag.value}</span>
          </div>
          {tag.timePeriod && (
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Time period: {tag.timePeriod}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-2 bg-gray-50 border-b border-gray-100">
        <div className="flex">
          <button
            className={`flex-1 text-sm py-1 bg-gray-100 px-2 rounded-md ${activeSection === "single" ? "bg-white shadow-sm" : "hover:bg-gray-100"}`}
            onClick={() => setActiveSection("single")}
          >
            Single Month
          </button>
          <button
            className={`flex-1 text-sm py-1 bg-gray-100 px-2 rounded-md ${activeSection === "span" ? "bg-white shadow-sm" : "hover:bg-gray-100"}`}
            onClick={() => setActiveSection("span")}
          >
            Time Span
          </button>
        </div>
      </div>

      <div className="max-h-60 overflow-y-auto">
        {activeSection === "single" ? (
          <div className="p-1">
            <button
              className="flex items-center w-full text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-md"
              onClick={() => handleSelectTimePeriod("this month")}
            >
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span>this month</span>
            </button>
            <button
              className="flex items-center w-full text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-md"
              onClick={() => handleSelectTimePeriod("previous month")}
            >
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span>previous month</span>
            </button>
            <button
              className="flex items-center w-full text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-md"
              onClick={() => handleSelectTimePeriod("1 year ago")}
            >
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span>1 year ago</span>
            </button>
          </div>
        ) : (
          <div className="p-1">
            <button
              className="flex items-center w-full text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-md"
              onClick={() => handleSelectTimePeriod("last 3 months")}
            >
              <Clock className="w-4 h-4 mr-2 text-gray-500" />
              <span>last 3 months</span>
            </button>
            <button
              className="flex items-center w-full text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-md"
              onClick={() => handleSelectTimePeriod("last 12 months")}
            >
              <Clock className="w-4 h-4 mr-2 text-gray-500" />
              <span>last 12 months</span>
            </button>
            <button
              className="flex items-center w-full text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-md"
              onClick={() => handleSelectTimePeriod("Calendar ytd")}
            >
              <Clock className="w-4 h-4 mr-2 text-gray-500" />
              <span>Calendar ytd</span>
            </button>
            <button
              className="flex items-center w-full text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-md"
              onClick={() => handleSelectTimePeriod("cumulative")}
            >
              <Clock className="w-4 h-4 mr-2 text-gray-500" />
              <span>cumulative</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

