import { create } from "zustand"

type FormulaItemType = "tag" | "operand" | "number"

interface FormulaTag {
  type: "tag"
  id: string
  name: string
  category: string
  value: number
  timePeriod?: string
}

interface FormulaOperand {
  type: "operand"
  value: string
}

interface FormulaNumber {
  type: "number"
  value: number
}

type FormulaItem = FormulaTag | FormulaOperand | FormulaNumber

interface FormulaState {
  formula: FormulaItem[]
  result: number | null
  addTag: (tag: Omit<FormulaTag, "type">) => void
  addOperand: (operand: string) => void
  addNumber: (num: number) => void
  removeLastItem: () => void
  setFormula: (formula: FormulaItem[]) => void
  updateTagTimePeriod: (tagId: string, timePeriod: string) => void
  calculateResult: () => void
}

// Simple calculator function to evaluate expressions safely
function evaluateExpression(expression: string): number | null {
  try {
    // Basic operations
    const add = (a: number, b: number) => a + b
    const subtract = (a: number, b: number) => a - b
    const multiply = (a: number, b: number) => a * b
    const divide = (a: number, b: number) => a / b

    // Convert the expression to a simple array of numbers and operators
    const tokens: (number | string)[] = []
    let currentNumber = ""

    for (let i = 0; i < expression.length; i++) {
      const char = expression[i]

      if (char === " ") continue

      if ("0123456789.".includes(char)) {
        currentNumber += char
      } else {
        if (currentNumber) {
          tokens.push(Number.parseFloat(currentNumber))
          currentNumber = ""
        }

        if ("+-*/()".includes(char)) {
          tokens.push(char)
        }
      }
    }

    if (currentNumber) {
      tokens.push(Number.parseFloat(currentNumber))
    }

    // Very simple expression evaluator for basic operations
    // This is a simplified version that only handles basic operations in sequence
    // A real implementation would need to handle order of operations and parentheses
    let result = 0
    let currentOp = "+"

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]

      if (typeof token === "number") {
        if (currentOp === "+") result = add(result, token)
        else if (currentOp === "-") result = subtract(result, token)
        else if (currentOp === "*") result = multiply(result, token)
        else if (currentOp === "/") result = divide(result, token)
      } else if (typeof token === "string" && "+-*/".includes(token)) {
        currentOp = token
      }
    }

    return result
  } catch (error) {
    console.error("Error evaluating expression:", error)
    return null
  }
}

export const useFormulaStore = create<FormulaState>((set, get) => ({
  formula: [],
  result: null,

  addTag: (tag) => {
    set((state) => ({
      formula: [...state.formula, { type: "tag", ...tag, timePeriod: "this month" }],
    }))
  },

  addOperand: (operand) => {
    set((state) => ({
      formula: [...state.formula, { type: "operand", value: operand }],
    }))
  },

  addNumber: (num) => {
    set((state) => ({
      formula: [...state.formula, { type: "number", value: num }],
    }))
  },

  removeLastItem: () => {
    set((state) => ({
      formula: state.formula.slice(0, -1),
    }))
  },

  setFormula: (formula) => {
    set({ formula })
  },

  updateTagTimePeriod: (tagId, timePeriod) => {
    set((state) => ({
      formula: state.formula.map((item) => {
        if (item.type === "tag" && item.id === tagId) {
          return { ...item, timePeriod }
        }
        return item
      }),
    }))
  },

  calculateResult: () => {
    const { formula } = get()

    if (formula.length === 0) {
      set({ result: null })
      return
    }

    try {
      // Build a simple expression string from the formula items
      let expressionString = ""

      for (const item of formula) {
        if (item.type === "tag") {
          expressionString += item.value
        } else if (item.type === "number") {
          expressionString += item.value
        } else if (item.type === "operand") {
          expressionString += item.value
        }
      }

      // Use our custom evaluator instead of Function constructor
      const result = evaluateExpression(expressionString)
      set({ result })
    } catch (error) {
      console.error("Error calculating result:", error)
      set({ result: null })
    }
  },
}))

