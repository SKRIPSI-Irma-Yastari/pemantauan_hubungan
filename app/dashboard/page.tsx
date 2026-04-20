"use client"

import { useState, useEffect, useMemo } from "react"

import { 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowUpRight, 
  ChevronRight,
  MoreHorizontal,
  Clock,
  ArrowRight,
  History
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MetricCard } from "@/components/ui/metric-card"
import { StabilityGauge } from "@/components/ui/stability-gauge"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from 'recharts'

// Dynamic data helpers
const getComplianceScore = (compliance: string) => {
  if (!compliance) return 0
  if (compliance.includes("Sangat")) return 100
  if (compliance.includes("Cukup")) return 75
  if (compliance.includes("Kurang")) return 40
  return 0
}

const getRatingStatus = (rating: string): "HARMONIOUS" | "STABLE" | "CRITICAL" => {
  if (rating === "Sangat Baik") return "HARMONIOUS"
  if (rating === "Cukup") return "STABLE"
  return "CRITICAL"
}

export default function DashboardPage() {
  const [surveys, setSurveys] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSurveys() {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('surveys')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setSurveys(data || [])
      } catch (err) {
        console.error("Error fetching surveys:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSurveys()
  }, [])

  const metrics = useMemo(() => {
    if (!surveys.length) return {
      totalKKKS: 0,
      harmonis: 0,
      attention: 0,
      compliance: "0%",
      stabilityScore: 0,
      stabilityStatus: "STABLE" as const,
      chartData: [
        { name: 'Harmonis', value: 0, color: 'var(--color-tertiary)' },
        { name: 'Stable', value: 0, color: 'var(--color-primary)' },
        { name: 'Disharmonis', value: 0, color: 'var(--color-error)' },
      ],
      recentActivities: []
    }

    const uniqueKKKS = new Set(surveys.map(s => s.kkks)).size
    const harmonisCount = surveys.filter(s => s.relationship_rating === "Sangat Baik").length
    const criticalCount = surveys.filter(s => s.relationship_rating === "Kurang Baik").length
    const stableCount = surveys.length - harmonisCount - criticalCount

    const avgCompliance = surveys.reduce((acc, s) => acc + getComplianceScore(s.compliance), 0) / surveys.length
    
    // Overall stability score based on relationship rating
    const totalScore = surveys.reduce((acc, s) => {
      if (s.relationship_rating === "Sangat Baik") return acc + 100
      if (s.relationship_rating === "Cukup") return acc + 70
      return acc + 40
    }, 0)
    const stabilityScore = totalScore / surveys.length
    
    let stabilityStatus: "HARMONIOUS" | "STABLE" | "CRITICAL" = "STABLE"
    if (stabilityScore > 85) stabilityStatus = "HARMONIOUS"
    else if (stabilityScore < 60) stabilityStatus = "CRITICAL"

    const chartData = [
      { name: 'Harmonis', value: harmonisCount, color: 'var(--color-tertiary)' },
      { name: 'Stable', value: stableCount, color: 'var(--color-primary)' },
      { name: 'Disharmonis', value: criticalCount, color: 'var(--color-error)' },
    ]

    const recentActivities = surveys.slice(0, 3).map(s => ({
      id: s.id,
      kkks: s.kkks,
      action: `Survey submitted for ${s.month} ${s.year}`,
      time: new Date(s.created_at).toLocaleDateString(),
      status: s.relationship_rating === "Kurang Baik" ? "warning" : "success",
      score: `${getComplianceScore(s.compliance)}%`
    }))

    return {
      totalKKKS: uniqueKKKS,
      harmonis: harmonisCount,
      attention: criticalCount,
      compliance: `${avgCompliance.toFixed(1)}%`,
      stabilityScore: Math.round(stabilityScore),
      stabilityStatus,
      chartData,
      recentActivities
    }
  }, [surveys])
  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-on-background">
            Executive Overview
          </h2>
          <p className="mt-1 text-on-surface-variant/70 font-medium">
            Monitoring kestabilan hubungan KKKS & Stakeholder Migas Aceh.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-xl bg-surface-container-high px-4 py-2.5 text-sm font-bold text-on-surface transition-all hover:bg-surface-variant active:scale-95">
            Unduh Laporan
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95">
            Analisis Baru
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total KKKS"
          value={metrics.totalKKKS}
          subtitle="Aktif di Wilayah Kerja Aceh"
          icon={Users}
          color="primary"
          trend={{ value: 0, positive: true }}
        />
        <MetricCard 
          title="Harmonis"
          value={metrics.harmonis}
          subtitle="Status Hubungan Optimal"
          icon={ShieldCheck}
          color="tertiary"
          trend={{ value: 0, positive: true }}
        />
        <MetricCard 
          title="Butuh Perhatian"
          value={metrics.attention}
          subtitle="Kurang Harmonis / Kritikal"
          icon={AlertTriangle}
          color="error"
          trend={{ value: 0, positive: false }}
        />
        <MetricCard 
          title="Tingkat Kepatuhan"
          value={metrics.compliance}
          subtitle="Rata-rata Pengiriman Laporan"
          icon={Clock}
          color="secondary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Analysis Section */}
        <div className="lg:col-span-8 space-y-8">
          {/* Classification Distribution Chart */}
          <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/5">
            <div className="flex items-center justify-between mb-8 text-sm">
              <h3 className="font-heading text-lg font-bold text-on-surface">
                Distribusi Klasifikasi Hubungan
              </h3>
              <select className="bg-transparent border-none font-bold text-primary outline-none cursor-pointer">
                <option>Semester I 2024</option>
                <option>Semester II 2023</option>
              </select>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--outline-variant)" opacity={0.1} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 600, fill: 'var(--on-surface-variant)' }} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'var(--surface-container-low)', radius: 8 }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                    {metrics.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Monitoring Alerts */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-heading text-lg font-bold text-on-surface">
                Aktivitas Terkini
              </h3>
              <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                LIHAT SEMUA <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {metrics.recentActivities.length === 0 ? (
                <div className="col-span-3 p-10 text-center text-on-surface-variant/40 font-bold uppercase tracking-widest text-[10px] bg-surface-container-low rounded-xl">
                  No recent institutional activities detected.
                </div>
              ) : (
                metrics.recentActivities.map((activity) => (
                  <div 
                    key={activity.id}
                    className="group bg-surface-container-low p-4 rounded-xl border border-transparent transition-all hover:bg-surface-container-lowest hover:shadow-md hover:border-outline-variant/10 cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-sm text-on-surface truncate pr-2">
                        {activity.kkks}
                      </p>
                      <span className="text-[10px] font-bold text-on-surface-variant opacity-50 flex-shrink-0">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant/80 mb-3 line-clamp-2 leading-relaxed">
                      {activity.action}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] font-bold border",
                        activity.status === "success" 
                          ? "bg-tertiary-container/20 text-tertiary border-tertiary/10" 
                          : "bg-error-container/20 text-error border-error/10"
                      )}>
                        {activity.score} Reliability
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Widgets Section */}
        <div className="lg:col-span-4 space-y-8">
          {/* Signature Stability Gauge Card */}
          <div className="rounded-3xl bg-surface-container-lowest p-8 shadow-sm border border-outline-variant/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
            <StabilityGauge score={metrics.stabilityScore} status={metrics.stabilityStatus} />
          </div>

          {/* Quick Action Link Card */}
          <div className="rounded-2xl bg-primary p-6 text-on-primary shadow-xl shadow-primary/20 group cursor-pointer overflow-hidden relative">
            <div className="relative z-10">
              <div className="mb-4 h-10 w-10 flex items-center justify-center rounded-xl bg-white/20">
                <History className="h-5 w-5" />
              </div>
              <h4 className="font-heading text-lg font-bold">Historical Patterns</h4>
              <p className="mt-1 text-sm text-primary-fixed opacity-80 leading-relaxed">
                Analyze stakeholder behavior over the last 5 years to predict future trends.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
                Open Analytics <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
            {/* Ambient light effect */}
            <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-tertiary opacity-20 blur-3xl group-hover:opacity-40 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  )
}
