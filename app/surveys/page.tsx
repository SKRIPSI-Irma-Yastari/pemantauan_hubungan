"use client"

import { 
  Plus, 
  Search, 
  ChevronRight, 
  Edit2, 
  Trash2, 
  TrendingUp, 
  Calendar, 
  AlertCircle,
  Filter,
  ChevronLeft
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"

const stats = [
  { label: "Average Compliance", value: "86.4%", trend: "+4.2% since last month", icon: TrendingUp, color: "primary" },
  { label: "Total Submissions", value: "142", trend: "Q1 Fiscal Period 2024", icon: Calendar, color: "secondary" },
  { label: "Pending Reviews", value: "08", trend: "Requires attention in Aceh Utara", icon: AlertCircle, color: "tertiary" },
]

const surveyData = [
  { id: "KKKS-001-ACEH", name: "Medco E&P Malaka", region: "Aceh Timur", period: "Januari 2024", compliance: 92, attendance: "100%", response: "24/24", rating: "Excellent" },
  { id: "KKKS-042-ACEH", name: "Pertamina EP Asset 1", region: "Rantau", period: "Januari 2024", compliance: 85, attendance: "95%", response: "22/24", rating: "Stable" },
  { id: "KKKS-009-ACEH", name: "Triangle Pase Inc", region: "Aceh Utara", period: "Desember 2023", compliance: 72, attendance: "88%", response: "18/24", rating: "Review Needed" },
  { id: "KKKS-015-ACEH", name: "Zaratex Energy Ltd", region: "Lhokseumawe", period: "Januari 2024", compliance: 95, attendance: "100%", response: "24/24", rating: "Excellent" },
]

export default function SurveyManagementPage() {
  return (
    <div className="p-8 space-y-10 max-w-[1500px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase mb-2">
            <span>Analytics</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">Survey Management</span>
          </nav>
          <h1 className="text-3xl font-heading font-extrabold text-on-background tracking-tight">Institutional Survey Registry</h1>
          <p className="text-on-surface-variant font-medium text-sm mt-1 max-w-xl">Monitor and manage the compliance data flow across all KKKS entities in the Aceh region.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-surface-container-low rounded-xl p-1">
            <button className="px-4 py-2 text-xs font-bold bg-surface-container-lowest shadow-sm rounded-lg text-primary uppercase">All Regions</button>
            <button className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:text-primary uppercase transition-colors">Wilayah Aceh</button>
          </div>
          <Link href="/surveys/new">
            <button className="flex items-center gap-2 bg-primary hover:opacity-90 text-on-primary px-6 py-3 rounded-xl transition-all font-heading font-bold text-sm shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" />
              Add New Survey
            </button>
          </Link>
        </div>
      </div>

      {/* Registry Table Section */}
      <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <th className="px-8 py-5">Nama KKKS</th>
                <th className="px-6 py-5">Wilayah</th>
                <th className="px-6 py-5">Periode</th>
                <th className="px-6 py-5">Skor Kepatuhan</th>
                <th className="px-6 py-5 text-center">Kehadiran</th>
                <th className="px-6 py-5 text-center">Respons</th>
                <th className="px-6 py-5">Penilaian</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {surveyData.map((row, idx) => (
                <tr key={row.id} className={cn(
                  "hover:bg-surface-container-low transition-colors group border-b border-outline-variant/5",
                  idx % 2 === 1 ? "bg-surface-container/30" : "bg-transparent"
                )}>
                  <td className="px-8 py-6">
                    <div className="font-bold text-on-surface">{row.name}</div>
                    <div className="text-[10px] text-on-surface-variant opacity-60 font-medium">ID: {row.id}</div>
                  </td>
                  <td className="px-6 py-6 text-on-surface-variant font-medium">{row.region}</td>
                  <td className="px-6 py-6">
                    <span className="bg-primary/5 text-primary px-3 py-1 rounded-full text-[10px] font-bold border border-primary/10">
                      {row.period}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${row.compliance}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.3)]"
                        />
                      </div>
                      <span className="font-bold text-primary">{row.compliance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center font-bold text-on-surface">{row.attendance}</td>
                  <td className="px-6 py-6 text-center font-mono text-[11px] text-on-surface-variant">{row.response}</td>
                  <td className="px-6 py-6">
                    <span className={cn(
                      "text-[9px] font-extrabold px-2.5 py-1 rounded uppercase tracking-tighter border",
                      row.rating === "Excellent" && "bg-tertiary-container/30 text-tertiary border-tertiary/10",
                      row.rating === "Stable" && "bg-primary-container/30 text-primary border-primary/10",
                      row.rating === "Review Needed" && "bg-error-container/30 text-error border-error/10"
                    )}>
                      {row.rating}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-all hover:text-primary">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-error-container/20 rounded-lg text-on-surface-variant transition-all hover:text-error">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-8 py-5 bg-surface-container-low/50 border-t border-outline-variant/10 flex justify-between items-center text-[10px]">
          <p className="text-on-surface-variant font-bold uppercase tracking-[0.1em]">Showing 4 of 12 Institutional Records</p>
          <div className="flex gap-1">
            <button className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant transition-all">
              <ChevronLeft className="h-3 w-3" />
            </button>
            <button className="px-3 py-1 bg-primary text-on-primary rounded-lg font-bold">1</button>
            <button className="px-3 py-1 text-on-surface-variant font-bold hover:bg-surface-container rounded-lg transition-all">2</button>
            <button className="px-3 py-1 text-on-surface-variant font-bold hover:bg-surface-container rounded-lg transition-all">3</button>
            <button className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant transition-all">
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Editorial Style Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "p-8 rounded-[2rem] relative overflow-hidden group shadow-sm border border-outline-variant/5",
              stat.color === "primary" ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface"
            )}
          >
            <div className={cn(
              "absolute -right-8 -bottom-8 opacity-5 group-hover:scale-110 transition-transform duration-700",
              stat.color === "primary" ? "text-white" : "text-primary"
            )}>
              <stat.icon size={160} strokeWidth={1} />
            </div>
            
            <p className={cn(
              "text-[10px] font-bold tracking-[0.2em] uppercase mb-1",
              stat.color === "primary" ? "text-primary-dim/60" : "text-on-surface-variant/60"
            )}>
              {stat.label}
            </p>
            <h3 className="text-4xl font-heading font-extrabold tracking-tight">
              {stat.value.split('%')[0]}<span className="text-2xl font-medium opacity-50 px-0.5">{stat.value.includes('%') ? '%' : ''}</span>
            </h3>
            
            <div className="mt-6 flex items-center gap-2">
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                stat.color === "primary" ? "bg-white/10 border-white/10 text-white" : "bg-surface-container border-outline-variant/10 text-on-surface-variant"
              )}>
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
