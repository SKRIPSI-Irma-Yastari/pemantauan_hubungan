"use client"

import { useState, useEffect, useMemo } from "react"

import { 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowUpRight, 
  ChevronRight,
  Clock,
  History,
  FileClock,
  MessageCircle,
  X,
  Building2,
  MapPin,
  Mail,
  Phone
} from "lucide-react"
import { useProfile } from "@/hooks/use-profile"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { MetricCard } from "@/components/ui/metric-card"
import { StabilityGauge } from "@/components/ui/stability-gauge"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { 
  PieChart, 
  Pie, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts'

// Dynamic data helpers
const getComplianceNumericScore = (compliance: string) => {
  if (!compliance) return 0
  if (compliance.includes("Sangat")) return 100
  if (compliance.includes("Cukup")) return 75
  if (compliance.includes("Kurang")) return 40
  return 0
}

const getComplianceScoreFromKeterangan = (keterangan: string) => {
  switch (keterangan) {
    case "Submit via portal tepat waktu & data sinkron":
    case "Dokumen lengkap, lampiran sesuai regulasi":
    case "Respon sangat cepat (< 24 jam)":
    case "Dihadiri GM/Manager, proaktif dalam diskusi":
    case "Pemaparan data teknis sangat akurat & solutif":
    case "Mengadakan sertifikasi gratis untuk teknisi lokal":
    case "Menjadi narasumber utama & membawa vendor lokal":
    case "Proaktif berbagi studi kasus pengeboran":
    case "Koordinasi program lingkungan sangat baik":
    case "Penyerapan tenaga kerja magang dari univ lokal":
    case "Memberikan edukasi K3LL kepada tim teknis BPMA":
    case "Koordinasi program pemberdayaan masyarakat sangat baik":
      return 100
    case "Submit tepat waktu, ada revisi minor":
    case "Laporan diterima dengan catatan kecil":
    case "Dibalas dalam 2-3 hari kerja":
    case "Tanggapan diterima sesuai durasi standar":
    case "Hadir diwakili staf teknis, cukup kooperatif":
    case "Pemaparan cukup, ada tindak lanjut tambahan":
      return 85
    case "Keterlambatan submit > 24 jam":
    case "Sering membutuhkan follow-up berkali-kali":
    case "Hadir namun kontribusi data vendor masih minim":
      return 50
    case "Lampiran tidak lengkap, butuh revisi besar":
    case "Data teknis tidak siap saat pemaparan":
      return 40
    case "Tidak ada balasan setelah 3 hari kerja":
    case "Tidak hadir tanpa konfirmasi/berhalangan":
    case "Belum membuka kuota magang lokal / tidak kooperatif":
      return 0
    default:
      return 100
  }
}

const getRatingStatus = (rating: string): "HARMONIOUS" | "STABLE" | "CRITICAL" => {
  if (rating === "Sangat Baik" || rating === "Cukup" || rating === "Harmonis") return "HARMONIOUS"
  if (rating === "Cukup") return "STABLE"
  return "CRITICAL"
}

const CRITICAL_ALERT_MAPPINGS: Record<string, { type: "TERLAMBAT" | "PERINGATAN"; messageTemplate: string }> = {
  "Tidak ada balasan setelah 3 hari kerja": {
    type: "TERLAMBAT",
    messageTemplate: "Tidak ada balasan komunikasi setelah 3 hari kerja"
  },
  "Sering membutuhkan follow-up berkali-kali": {
    type: "PERINGATAN",
    messageTemplate: "Korespondensi membutuhkan follow-up berkali-kali"
  },
  "Keterlambatan submit > 24 jam": {
    type: "TERLAMBAT",
    messageTemplate: "Terlambat mengirimkan laporan harian (> 24 jam)"
  },
  "Lampiran tidak lengkap, butuh revisi besar": {
    type: "PERINGATAN",
    messageTemplate: "Laporan FQR tidak lengkap (butuh revisi besar)"
  },
  "Tidak hadir tanpa konfirmasi/berhalangan": {
    type: "PERINGATAN",
    messageTemplate: "Tidak hadir rapat MCM tanpa konfirmasi"
  },
  "Data teknis tidak siap saat pemaparan": {
    type: "PERINGATAN",
    messageTemplate: "Data teknis tidak siap saat pemaparan Technical Review"
  },
  "Belum membuka kuota magang lokal / tidak kooperatif": {
    type: "PERINGATAN",
    messageTemplate: "Belum membuka kuota magang lokal / tidak kooperatif"
  },
  "Hadir namun kontribusi data vendor masih minim": {
    type: "PERINGATAN",
    messageTemplate: "Kontribusi data vendor lokal masih minim di forum"
  }
}

export default function DashboardPage() {
  const [surveys, setSurveys] = useState<any[]>([])
  const [interactions, setInteractions] = useState<any[]>([])
  const [stakeholders, setStakeholders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isStakeholdersModalOpen, setIsStakeholdersModalOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState<string>("Semua")
  const [selectedMonth, setSelectedMonth] = useState<string>("Semua")

  const { profile, loading: profileLoading } = useProfile()
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      if (!profile) {
        if (!profileLoading) setIsLoading(false)
        return
      }

      if (profile.role !== 'bpma') {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const [surveysRes, reportsRes, interactionsRes, commsRes, stakeholdersRes] = await Promise.all([
          supabase.from('surveys').select('*'),
          supabase.from('reports').select('*, stakeholders(name)').order('submitted_at', { ascending: false }),
          supabase.from('interaction_data').select('*, stakeholders(name)').order('created_at', { ascending: false }),
          supabase.from('communications').select('*, stakeholders(name)').order('sent_at', { ascending: false }),
          supabase.from('stakeholders').select('*').order('name', { ascending: true })
        ])

        if (surveysRes.error) throw surveysRes.error
        setSurveys(surveysRes.data || [])
        setInteractions(interactionsRes.data || [])
        setStakeholders(stakeholdersRes.data || [])
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [profile, profileLoading])

  const metrics = useMemo(() => {
    const filteredSurveys = surveys.filter(s => {
      const matchYear = selectedYear === "Semua" || String(s.year) === selectedYear
      const matchMonth = selectedMonth === "Semua" || String(s.month) === selectedMonth
      return matchYear && matchMonth
    })

    const filteredInteractions = interactions.filter(i => {
      const matchYear = selectedYear === "Semua" || String(i.tahun) === selectedYear
      const matchMonth = selectedMonth === "Semua" || String(i.bulan) === selectedMonth
      return matchYear && matchMonth
    })

    // Generate dynamic compliance alerts based on critical interaction logs
    const complianceAlerts = filteredInteractions
      .filter(i => i.keterangan && CRITICAL_ALERT_MAPPINGS[i.keterangan])
      .map(i => {
        const mapping = CRITICAL_ALERT_MAPPINGS[i.keterangan]
        return {
          id: String(i.id),
          kkks: i.stakeholders?.name || "KKKS",
          message: `${mapping.messageTemplate} (${i.bulan} ${i.tahun})`,
          type: mapping.type
        }
      })

    const finalAlerts = complianceAlerts.length > 0 ? complianceAlerts.slice(0, 3) : [
      {
        id: "demo-1",
        kkks: "Mubadala Energy",
        message: "Belum mengirimkan Laporan Bulanan (Maret 2026)",
        type: "TERLAMBAT" as const
      },
      {
        id: "demo-2",
        kkks: "Premier Oil",
        message: "Respon komunikasi melambat (Rata-rata 4.2 hari)",
        type: "PERINGATAN" as const
      }
    ]

    if (filteredSurveys.length === 0 && filteredInteractions.length === 0) return {
      totalKKKS: 0,
      harmonis: 0,
      attention: 0,
      compliance: "0%",
      stabilityScore: 0,
      stabilityStatus: "STABLE" as const,
      chartData: [
        { name: 'Harmonis', value: 0, color: 'var(--color-tertiary)' },
        { name: 'Kurang Harmonis', value: 0, color: 'var(--color-error)' },
      ],
      recentActivities: [],
      complianceAlerts: finalAlerts
    }

    const uniqueKKKS = new Set([
      ...filteredSurveys.map(s => s.kkks),
      ...filteredInteractions.map(i => i.stakeholders?.name).filter(Boolean)
    ]).size
    
    let harmonisCount = 0
    let kurangHarmonisCount = 0
    let totalComplianceNumeric = 0
    let complianceCount = 0

    filteredSurveys.forEach(s => {
      if (s.relationship_rating === "Sangat Baik" || s.relationship_rating === "Cukup" || s.relationship_rating === "Harmonis") {
        harmonisCount++
      } else {
        kurangHarmonisCount++
      }

      totalComplianceNumeric += getComplianceNumericScore(s.compliance)
      complianceCount++
    })

    filteredInteractions.forEach(i => {
      if (i.keterangan) {
        totalComplianceNumeric += getComplianceScoreFromKeterangan(i.keterangan)
        complianceCount++
      } else if (i.compliance_score !== null && i.compliance_score !== undefined) {
        totalComplianceNumeric += Number(i.compliance_score)
        complianceCount++
      }
      if (i.status) {
        if (i.status === "Harmonis") {
          harmonisCount++
        } else {
          kurangHarmonisCount++
        }
      }
    })

    const avgCompliance = complianceCount > 0 ? totalComplianceNumeric / complianceCount : 0
    let complianceStatus = `${Math.round(avgCompliance)}%`

    // Overall stability score based on relationship rating
    const totalScore = filteredSurveys.reduce((acc, s) => {
      if (s.relationship_rating === "Sangat Baik") return acc + 100
      if (s.relationship_rating === "Cukup") return acc + 70
      return acc + 40
    }, 0)
    const stabilityScore = filteredSurveys.length > 0 ? totalScore / filteredSurveys.length : 0
    
    let stabilityStatus: "HARMONIOUS" | "STABLE" | "CRITICAL" = "STABLE"
    if (stabilityScore > 85) stabilityStatus = "HARMONIOUS"
    else if (stabilityScore < 60 && stabilityScore > 0) stabilityStatus = "CRITICAL"

    const chartData = [
      { name: 'Harmonis', value: harmonisCount, color: 'var(--color-tertiary)' },
      { name: 'Kurang Harmonis', value: kurangHarmonisCount, color: 'var(--color-error)' },
    ]

    const allActivities = [
      ...filteredSurveys.map(s => ({
        id: `s-${s.id}`,
        kkks: s.kkks,
        action: `Survey submitted for ${s.month} ${s.year}`,
        time: new Date(s.created_at).getTime(),
        timeStr: new Date(s.created_at).toLocaleDateString(),
        status: s.relationship_rating === "Kurang Baik" ? "warning" : "success",
        score: s.compliance || "N/A"
      })),
      ...filteredInteractions.map(i => ({
        id: `i-${i.id}`,
        kkks: i.stakeholders?.name || "KKKS",
        action: `${i.jenis_interaksi || 'Interaksi'}: ${i.detail_aktivitas || '-'}`,
        time: new Date(i.created_at).getTime(),
        timeStr: `${i.bulan || ''} ${i.tahun || ''}` || new Date(i.created_at).toLocaleDateString(),
        status: "success",
        score: i.keterangan || "-"
      }))
    ].sort((a, b) => b.time - a.time)

    const recentActivities = allActivities.slice(0, 3).map(a => ({
      ...a,
      time: a.timeStr
    }))

    return {
      totalKKKS: uniqueKKKS,
      harmonis: harmonisCount,
      attention: kurangHarmonisCount,
      compliance: complianceStatus,
      stabilityScore: Math.round(stabilityScore),
      stabilityStatus,
      chartData,
      recentActivities,
      complianceAlerts: finalAlerts
    }
  }, [surveys, interactions, selectedYear, selectedMonth])

  if (profileLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant/40">Loading Intelligence...</p>
        </div>
      </div>
    )
  }

  if (profile?.role !== 'bpma') {
    return (
      <div className="p-8">
        <div className="bg-error/5 border border-error/20 p-8 rounded-[2.5rem] text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-error mb-4">Akses Ditolak</h2>
          <p className="text-on-surface-variant font-medium">Halaman ini hanya dapat diakses oleh administrator BPMA.</p>
          <button 
            onClick={() => router.push('/stakeholder/dashboard')}
            className="mt-8 px-8 py-3 bg-error text-on-error rounded-xl font-black text-sm hover:scale-105 transition-transform"
          >
            Buka Dashboard Stakeholder
          </button>
        </div>
      </div>
    )
  }
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
            Pemantauan Hubungan 
          </h2>
          <p className="mt-1 text-on-surface-variant/70 font-medium">
            Monitoring kestabilan hubungan KKKS & Stakeholder Migas Aceh.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => router.push('/data-input')}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
          >
            Analisis Baru
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Wilayah Kerja Aceh"
          value={metrics.totalKKKS}
          subtitle="Total KKKS Aktif (Klik untuk detail)"
          icon={Users}
          color="primary"
          onClick={() => setIsStakeholdersModalOpen(true)}
        />
        <MetricCard 
          title="Status Hubungan Optimal"
          value={metrics.harmonis}
          subtitle="Harmonis"
          icon={ShieldCheck}
          color="tertiary"
        />
        <MetricCard 
          title="Kurang Harmonis"
          value={metrics.attention}
          subtitle="Butuh Perhatian"
          icon={AlertTriangle}
          color="error"
        />
        <MetricCard 
          title="Rata-rata Pengiriman Laporan"
          value={metrics.compliance}
          subtitle="Tingkat Kepatuhan"
          icon={Clock}
          color="secondary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Card 1: Classification Distribution Chart */}
        <section className="lg:col-span-8 rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/5 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 text-sm">
            <h3 className="font-heading text-lg font-bold text-on-surface">
              Distribusi Klasifikasi Hubungan
            </h3>
            <div className="flex items-center gap-3">
              {/* Filter Tahun */}
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-surface-container-low border border-outline-variant/10 rounded-xl px-3 py-1.5 font-bold text-primary outline-none cursor-pointer text-xs focus:ring-2 focus:ring-primary/20"
              >
                <option value="Semua">Semua Tahun</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>

              {/* Filter Bulan */}
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-surface-container-low border border-outline-variant/10 rounded-xl px-3 py-1.5 font-bold text-primary outline-none cursor-pointer text-xs focus:ring-2 focus:ring-primary/20"
              >
                <option value="Semua">Semua Bulan</option>
                <option value="Januari">Januari</option>
                <option value="Februari">Februari</option>
                <option value="Maret">Maret</option>
                <option value="April">April</option>
                <option value="Mei">Mei</option>
                <option value="Juni">Juni</option>
                <option value="Juli">Juli</option>
                <option value="Agustus">Agustus</option>
                <option value="September">September</option>
                <option value="Oktober">Oktober</option>
                <option value="November">November</option>
                <option value="Desember">Desember</option>
              </select>
            </div>
          </div>
          
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Pie
                  data={metrics.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {metrics.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-xs font-bold text-on-surface-variant ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Card 2: Signature Stability Gauge Card */}
        <div className="lg:col-span-4 rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/5 relative overflow-hidden group flex flex-col justify-center items-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
          <StabilityGauge score={metrics.stabilityScore} status={metrics.stabilityStatus} />
        </div>

        {/* Card 3: Compliance Notifications */}
        <section className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-heading text-lg font-bold text-on-surface">
              Notifikasi Kepatuhan
            </h3>
          </div>
          
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
            <div className="divide-y divide-outline-variant/10">
              {metrics.complianceAlerts.map((alert) => (
                <div key={alert.id} className="p-4 flex items-center gap-4 hover:bg-surface-container-low transition-colors group cursor-pointer">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center",
                    alert.type === "TERLAMBAT" ? "bg-error/10 text-error" : "bg-warning/10 text-warning"
                  )}>
                    {alert.type === "TERLAMBAT" ? <FileClock size={20} /> : <MessageCircle size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface truncate">{alert.kkks}</p>
                    <p className="text-xs text-on-surface-variant/60 font-medium">{alert.message}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      alert.type === "TERLAMBAT" ? "text-error" : "text-warning"
                    )}>
                      {alert.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {isStakeholdersModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStakeholdersModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
            />
            {/* Content Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-surface-container-lowest p-6 sm:p-8 rounded-[2.5rem] border border-outline-variant/20 shadow-2xl overflow-y-auto flex flex-col z-10"
            >
              <button 
                onClick={() => setIsStakeholdersModalOpen(false)}
                className="absolute top-6 right-6 h-10 w-10 rounded-full flex items-center justify-center text-on-surface-variant/60 hover:bg-surface-container transition-colors z-20"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Building2 size={24} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-on-background">
                    Daftar Kontraktor Kontrak Kerja Sama (KKKS)
                  </h2>
                  <p className="text-xs sm:text-sm text-on-surface-variant/75 font-medium mt-0.5">
                    Terdapat {stakeholders.length} KKKS yang terdaftar di wilayah kerja Aceh.
                  </p>
                </div>
              </div>

              {stakeholders.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-on-surface-variant/40">
                  <Building2 size={48} className="mb-4 opacity-30" />
                  <p className="font-bold uppercase tracking-widest text-xs">Belum ada data KKKS</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1">
                  {stakeholders.map((sh) => (
                    <div 
                      key={sh.id}
                      className="bg-surface-container-low/60 hover:bg-surface-container-low rounded-3xl p-6 border border-outline-variant/5 hover:border-primary/20 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-lg font-heading font-black text-on-surface mb-3">
                          {sh.name}
                        </h3>
                        
                        <div className="space-y-2.5 text-xs text-on-surface-variant/80 font-medium">
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-primary/75" />
                            <span>P. Jawab: {sh.contact_person || 'Tidak ada data'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-primary/75" />
                            <span className="truncate">{sh.email || 'Tidak ada data'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-primary/75" />
                            <span>{sh.phone || 'Tidak ada data'}</span>
                          </div>
                          <div className="flex items-start gap-2 pt-2 border-t border-outline-variant/10 mt-2">
                            <MapPin size={14} className="text-primary/75 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{sh.address || 'Tidak ada data'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-outline-variant/10">
                <button 
                  onClick={() => {
                    setIsStakeholdersModalOpen(false)
                    router.push('/stakeholders')
                  }}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md shadow-primary/10 hover:shadow-lg transition-all"
                >
                  Kelola Stakeholder
                </button>
                <button 
                  onClick={() => setIsStakeholdersModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-surface-container-high text-on-surface text-xs font-bold hover:bg-surface-variant transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
