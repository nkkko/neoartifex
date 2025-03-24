"use client"

import { useState } from "react"
import { Check, Copy, FileCode, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

// Parse highlight ranges like "1,3-5,7-10"
function parseHighlightRanges(rangeStr: string): (number | [number, number])[] {
  const ranges: (number | [number, number])[] = [];
  
  rangeStr.split(',').forEach(part => {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      if (!isNaN(start) && !isNaN(end)) {
        ranges.push([start, end]);
      }
    } else {
      const num = Number(part);
      if (!isNaN(num)) {
        ranges.push(num);
      }
    }
  });
  
  return ranges;
}

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  language?: string
  title?: string
  showLineNumbers?: boolean
  highlightLines?: string
  showCopyButton?: boolean
}

export function CodeBlock({
  children,
  language,
  title,
  showLineNumbers = false,
  highlightLines = "",
  showCopyButton = true,
  className,
  ...props
}: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async () => {
    if (!children || typeof children !== "string") return

    await navigator.clipboard.writeText(children)
    setIsCopied(true)

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  const getLanguageIcon = () => {
    if (!language) return <FileCode className="h-4 w-4" />

    // Lookup icon based on language
    switch (language.toLowerCase()) {
      case "bash":
      case "sh":
      case "shell":
      case "zsh":
        return <Terminal className="h-4 w-4" />
      default:
        return <FileCode className="h-4 w-4" />
    }
  }

  // Process highlights
  const highlightRanges = highlightLines ? 
    parseHighlightRanges(highlightLines) : 
    [];

  const shouldHighlightLine = (lineNumber: number): boolean => {
    if (highlightRanges.length === 0) return false;
    
    return highlightRanges.some(range => {
      if (typeof range === 'number') {
        return lineNumber === range;
      } else if (Array.isArray(range)) {
        return lineNumber >= range[0] && lineNumber <= range[1];
      }
      return false;
    });
  };

  return (
    <div
      className={cn(
        "group relative my-4 rounded-lg border bg-muted",
        className
      )}
      {...props}
    >
      {/* Header */}
      {(title || language) && (
        <div className="flex items-center justify-between border-b bg-muted px-4 py-2 rounded-t-lg">
          <div className="flex items-center gap-2">
            {getLanguageIcon()}
            <span className="text-sm font-medium text-muted-foreground">
              {title || language}
            </span>
          </div>
        </div>
      )}

      {/* Code */}
      <div
        className={cn(
          "relative overflow-auto p-4 font-mono text-sm",
          showLineNumbers && "pl-12"
        )}
      >
        <pre className={`language-${language || 'text'} whitespace-pre-wrap`}>
          {typeof children === 'string' ? children.split('\n').map((line, i) => (
            <div
              key={i}
              className={cn(
                "whitespace-pre-wrap break-words",
                shouldHighlightLine(i + 1) && "highlight-line pl-2"
              )}
            >
              {line || " "}
            </div>
          )) : children}
        </pre>

        {/* Line numbers */}
        {showLineNumbers && typeof children === 'string' && (
          <div className="absolute left-0 top-4 flex flex-col items-end pr-2 text-xs text-muted-foreground">
            {children.split("\n").map((_, i) => (
              <span key={i} className="leading-relaxed">
                {i + 1}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Copy button */}
      {showCopyButton && (
        <button
          onClick={copyToClipboard}
          className="absolute right-3 top-3 rounded-md border bg-background p-2 opacity-70 hover:opacity-100"
          aria-label="Copy code to clipboard"
        >
          {isCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  )
}