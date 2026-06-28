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
  onClick?: () => void
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  color = "primary",
  className,
  onClick
}: MetricCardProps) {
  const colorMap = {
    primary: "text-primary",
    secondary: "text-secondary",
    tertiary: "text-tertiary",
    error: "text-error",
  }

  const bgMap = {
    primary: "bg-primary/[0.04] border-primary/10 hover:bg-primary/[0.08] hover:border-primary/20",
    secondary: "bg-secondary/[0.04] border-secondary/10 hover:bg-secondary/[0.08] hover:border-secondary/20",
    tertiary: "bg-tertiary/[0.04] border-tertiary/10 hover:bg-tertiary/[0.08] hover:border-tertiary/20",
    error: "bg-error/[0.04] border-error/10 hover:bg-error/[0.08] hover:border-error/20",
  }

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-[2rem] p-6 shadow-sm border transition-all duration-300 hover:shadow-md hover:-translate-y-1",
        bgMap[color],
        onClick && "cursor-pointer active:scale-[0.98] select-none",
        className
      )}
    >
      <div className="flex flex-col items-center text-center justify-center space-y-4">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-outline-variant/5 transition-transform group-hover:scale-110 duration-300", colorMap[color])}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/80">
            {title}
          </p>
          <h3 className="font-heading text-3xl font-black text-on-surface">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-on-surface-variant font-medium leading-relaxed opacity-80">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center justify-center gap-2">
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
        "absolute -right-4 -bottom-4 h-24 w-24 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20",
        color === "primary" && "bg-primary",
        color === "secondary" && "bg-secondary",
        color === "tertiary" && "bg-tertiary",
        color === "error" && "bg-error"
      )} />
    </div>
  )
}
