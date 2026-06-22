"use client"

import { cn } from "@/lib/utils"

interface StabilityGaugeProps {
  score: number
  label?: string
  status?: "HARMONIOUS" | "STABLE" | "CRITICAL"
  className?: string
}

export function StabilityGauge({ 
  score, 
  label = "Indeks Kestabilan", 
  status = "HARMONIOUS",
  className 
}: StabilityGaugeProps) {
  // Map score (0-100) to semi-circle path
  // Path for 100% is "M 10 50 A 40 40 0 0 1 90 50"
  // We'll use a CSS-based implementation with SVG for better precision
  
  const radius = 40
  const circumference = Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const statusConfig = {
    HARMONIOUS: {
      label: "HARMONIS",
      desc: "Hubungan kelembagaan berjalan dengan sangat harmonis dan optimal sesuai parameter regulasi."
    },
    STABLE: {
      label: "STABIL",
      desc: "Hubungan kelembagaan berada dalam kondisi stabil dan berjalan sesuai standar yang ditetapkan."
    },
    CRITICAL: {
      label: "KURANG HARMONIS",
      desc: "Hubungan kelembagaan menunjukkan indikasi kurang harmonis dan memerlukan perhatian khusus."
    }
  }

  return (
    <div className={cn("flex flex-col items-center justify-center text-center", className)}>
      <p className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 mb-6">
        {label}
      </p>
      
      <div className="relative h-24 w-48 mb-4">
        <svg className="h-full w-full" viewBox="0 0 100 50">
          {/* Background Path */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="var(--surface-container)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Progress Path */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="url(#gauge-gradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
          
          <defs>
            <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-tertiary)" />
              <stop offset="100%" stopColor="var(--color-tertiary-container)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Score Display (Glassmorphism overlay) */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-2">
          <span className="font-heading text-3xl font-extrabold text-on-surface">
            {score}<span className="text-sm font-bold opacity-40">%</span>
          </span>
        </div>
      </div>

      <div className="mt-2">
        <span className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold tracking-tight shadow-sm",
          status === "HARMONIOUS" && "bg-tertiary-container text-on-tertiary-container",
          status === "STABLE" && "bg-secondary-container text-on-secondary-container",
          status === "CRITICAL" && "bg-error-container text-on-error-container"
        )}>
          {statusConfig[status].label}
        </span>
        <p className="mt-3 px-6 text-[11px] leading-relaxed text-on-surface-variant opacity-70">
          {statusConfig[status].desc}
        </p>
      </div>
    </div>
  )
}
