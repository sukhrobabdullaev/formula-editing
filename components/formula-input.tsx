"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useFormulaStore } from "@/store/formula-store"
import { useQuery } from "@tanstack/react-query"
import { fetchSuggestions } from "@/lib/api"
import { Tag } from "@/components/tag"
import { Suggestions } from "@/components/suggestions"

export default function FormulaInput() {
  const { formula, addTag, addOperand, addNumber, removeLastItem, setFormula, calculateResult } = useFormulaStore()

  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch suggestions using React Query
  const { data: suggestions = [] } = useQuery({
    queryKey: ["suggestions", inputValue],
    queryFn: () => fetchSuggestions(inputValue),
    enabled: inputValue.length > 0 && showSuggestions,
  })

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (value.length > 0) {
      setShowSuggestions(true)
    }
  }

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to remove last tag or operand
    if (e.key === "Backspace" && inputValue === "") {
      e.preventDefault()
      removeLastItem()
    }

    // Handle operands 
    if (["+", "-", "*", "/", "(", ")", "^"].includes(e.key)) {
      e.preventDefault()
      if (inputValue) {
        // If there's input, try to add it as a number first
        if (!isNaN(Number(inputValue))) {
          addNumber(Number(inputValue))
        }
        setInputValue("")
      }
      addOperand(e.key)
    }

    // Handle enter to add tag or number
    if (e.key === "Enter") {
      e.preventDefault()
      if (inputValue) {
        if (!isNaN(Number(inputValue))) {
          addNumber(Number(inputValue))
        }
        setInputValue("")
        setShowSuggestions(false)
      }
    }

    // Handle space to add number
    if (e.key === " " && inputValue) {
      e.preventDefault()
      if (!isNaN(Number(inputValue))) {
        addNumber(Number(inputValue))
        setInputValue("")
      }
    }
  }

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: any) => {
    addTag({
      id: suggestion.id,
      name: suggestion.name,
      category: suggestion.category,
      value: suggestion.value,
    })
    setInputValue("")
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  // Focus input when clicking on the container
  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      inputRef.current?.focus()
    }
  }

  // Calculate result whenever formula changes
  useEffect(() => {
    calculateResult()
  }, [formula, calculateResult])

  return (
    <div className="w-full max-w-4xl">
      <div
        ref={containerRef}
        className="relative flex flex-wrap items-center p-3 border border-purple-300 rounded-lg bg-white min-h-14 focus-within:ring-2 focus-within:ring-purple-400 focus-within:border-purple-400"
        onClick={handleContainerClick}
      >
        <span className="mr-1 text-gray-500">=</span>

        {formula.map((item, index) => {
          if (item.type === "tag") {
            return (
              <Tag
                key={`${item.id}-${index}`}
                tag={item}
                onRemove={() => {
                  const newFormula = [...formula]
                  newFormula.splice(index, 1)
                  setFormula(newFormula)
                }}
              />
            )
          } else if (item.type === "operand") {
            return (
              <span key={`operand-${index}`} className="mx-1 text-gray-700">
                {item.value}
              </span>
            )
          } else if (item.type === "number") {
            return (
              <span key={`number-${index}`} className="mx-1 text-gray-700">
                {item.value}
              </span>
            )
          }
          return null
        })}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue) setShowSuggestions(true)
          }}
          onBlur={() => {
            // Delay hiding suggestions to allow for clicks
            setTimeout(() => setShowSuggestions(false), 200)
          }}
          className="flex-grow outline-none min-w-[100px] bg-transparent"
          placeholder={formula.length === 0 ? "Start typing..." : ""}
        />

        {showSuggestions && suggestions.length > 0 && (
          <Suggestions suggestions={suggestions} onSelect={handleSelectSuggestion} inputRef={inputRef} />
        )}
      </div>

      {formula.length > 0 && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <p className="font-mono">
            Result:{" "}
            {useFormulaStore.getState().result !== null ? useFormulaStore.getState().result : "Invalid expression"}
          </p>
        </div>
      )}
    </div>
  )
}

