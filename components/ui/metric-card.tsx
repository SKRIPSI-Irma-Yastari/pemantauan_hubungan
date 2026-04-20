"use client"

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    positive: boolean
  }
  icon: LucideIcon
  color?: "primary" | "secondary" | "tertiary" | "error"
  className?: string
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  color = "primary",
  className
}: MetricCardProps) {
  const colorMap = {
    primary: "text-primary bg-primary/10",
    secondary: "text-secondary bg-secondary/10",
    tertiary: "text-tertiary bg-tertiary-container/30",
    error: "text-error bg-error-container/20",
  }

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1",
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
            {title}
          </p>
          <h3 className="mt-1 font-heading text-2xl font-extrabold text-on-surface">
            {value}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs text-on-surface-variant font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", colorMap[color])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-bold",
            trend.positive ? "bg-tertiary-container/50 text-on-tertiary-container" : "bg-error-container/30 text-error"
          )}>
            {trend.positive ? "+" : "-"}{trend.value}%
          </span>
          <span className="text-[10px] font-medium text-on-surface-variant/50">
            vs last month
          </span>
        </div>
      )}

      {/* Decorative background shape */}
      <div className={cn(
        "absolute -right-4 -bottom-4 h-24 w-24 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40",
        colorMap[color].split(" ")[1]
      )} />
    </div>
  )
}
