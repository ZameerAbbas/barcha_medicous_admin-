

import * as React from "react"
import { cn } from "../../lib/utils"

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", onWheel, onKeyDown, ...props }, ref) => {
    // Handler to prevent scroll/arrow changing number inputs
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (type === "number" && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault()
      }
      onKeyDown?.(e)
    }

    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
      if (type === "number") {
        e.currentTarget.blur()
      }
      onWheel?.(e)
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          // Hide spin buttons
          "[-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none",
          className
        )}
        ref={ref}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
export type { InputProps }
