import React from "react"

interface TimelineProps {
  children: React.ReactNode
  className?: string
}

interface TimelineItemProps {
  children: React.ReactNode
  className?: string
}

interface TimelineSeparatorProps {
  children: React.ReactNode
  className?: string
}

interface TimelineDotProps {
  className?: string
}

interface TimelineConnectorProps {
  className?: string
}

interface TimelineContentProps {
  children: React.ReactNode
  className?: string
}

export function Timeline({ children, className = "" }: TimelineProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  )
}

export function TimelineItem({ children, className = "" }: TimelineItemProps) {
  return (
    <div className={`flex mb-6 last:mb-0 ${className}`}>
      {children}
    </div>
  )
}

export function TimelineSeparator({ children, className = "" }: TimelineSeparatorProps) {
  return (
    <div className={`flex flex-col items-center mr-4 ${className}`}>
      {children}
    </div>
  )
}

export function TimelineDot({ className = "" }: TimelineDotProps) {
  return (
    <div className={`w-4 h-4 rounded-full ${className}`} />
  )
}

export function TimelineConnector({ className = "" }: TimelineConnectorProps) {
  return (
    <div className={`w-0.5 h-full bg-gray-200 my-2 ${className}`} />
  )
}

export function TimelineContent({ children, className = "" }: TimelineContentProps) {
  return (
    <div className={`flex-1 pt-0.5 ${className}`}>
      {children}
    </div>
  )
}
