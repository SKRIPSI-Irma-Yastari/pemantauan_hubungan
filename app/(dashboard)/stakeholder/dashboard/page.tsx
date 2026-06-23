"use client"

import { useEffect, useState, useMemo } from "react"
import { 
  ShieldCheck, 
  Calendar, 
  FileText, 
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Users,
  Filter
} from "lucide-react"
import { useProfile } from "@/hooks/use-profile"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { MetricCard } from "@/components/ui/metric-card"
import { motion } from "framer-motion"

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

export default function StakeholderDashboard() {
  const { profile, loading: profileLoading } = useProfile()
  const [stakeholder, setStakeholder] = useState<any>(null)
  const [surveys, setSurveys] = useState<any[]>([])
  const [interactions, setInteractions] = useState<any[]>([])
  const [attendance, setAttendance] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [selectedYear, setSelectedYear] = useState<string>("Semua")
  const [selectedMonth, setSelectedMonth] = useState<string>("Semua")

  useEffect(() => {
    async function fetchData() {
      if (!profile) {
        if (!profileLoading) setIsLoading(false)
        return
      }

      if (profile.role !== 'stakeholder' || !profile.stakeholder_id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)

        // 1. Fetch stakeholder profile info
        const shRes = await supabase
          .from('stakeholders')
          .select('*')
          .eq('id', profile.stakeholder_id)
          .single()
        
        if (shRes.error) throw shRes.error
        setStakeholder(shRes.data)

        const shName = shRes.data.name

        // 2. Fetch surveys, interactions, and attendance in parallel
        const [surveysRes, interactionsRes, attendanceRes] = await Promise.all([
          supabase.from('surveys').select('*').eq('kkks', shName).order('year', { ascending: false }).order('month', { ascending: false }),
          supabase.from('interaction_data').select('*').eq('stakeholder_id', profile.stakeholder_id).order('created_at', { ascending: false }),
          supabase.from('attendance').select('*, meetings(*)').eq('stakeholder_id', profile.stakeholder_id)
        ])

        setSurveys(surveysRes.data || [])
        setInteractions(interactionsRes.data || [])
        setAttendance(attendanceRes.data || [])

      } catch (err) {
        console.error("Error fetching stakeholder dashboard data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [profile, profileLoading])

  // Compute metrics dynamically
  const metrics = useMemo(() => {
    const filteredSurveys = surveys.filter(s => {
      const matchYear = selectedYear === "Semua" || String(s.year) === selectedYear
      const matchMonth = selectedMonth === "Semua" || String(s.month).toLowerCase() === selectedMonth.toLowerCase()
      return matchYear && matchMonth
    })

    const filteredInteractions = interactions.filter(i => {
      const matchYear = selectedYear === "Semua" || String(i.tahun) === selectedYear
      const matchMonth = selectedMonth === "Semua" || String(i.bulan).toLowerCase() === selectedMonth.toLowerCase()
      return matchYear && matchMonth
    })

    const filteredAttendance = attendance.filter(a => {
      if (!a.meetings?.date) return true
      const mDate = new Date(a.meetings.date)
      const matchYear = selectedYear === "Semua" || mDate.getFullYear().toString() === selectedYear
      
      const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
      const mMonthName = monthNames[mDate.getMonth()]
      const matchMonth = selectedMonth === "Semua" || mMonthName.toLowerCase() === selectedMonth.toLowerCase()
      
      return matchYear && matchMonth
    })

    const totalInteractions = filteredInteractions.length
    
    // Calculate average compliance from filtered interactions
    let complianceSum = 0
    let complianceCount = 0
    filteredInteractions.forEach(i => {
      if (i.keterangan) {
        complianceSum += getComplianceScoreFromKeterangan(i.keterangan)
        complianceCount++
      }
    })
    const avgCompliance = complianceCount > 0 ? Math.round(complianceSum / complianceCount) : 100

    // Calculate meeting attendance rate from Rapat interaction logs
    const rapatInteractions = filteredInteractions.filter(i => i.jenis_interaksi === "Rapat")
    const totalMeetingsInvited = rapatInteractions.length
    const meetingsAttended = rapatInteractions.filter(i => i.keterangan !== "Tidak hadir tanpa konfirmasi/berhalangan").length
    const attendanceRate = totalMeetingsInvited > 0 ? Math.round((meetingsAttended / totalMeetingsInvited) * 100) : 0

    // Get latest relationship status
    let latestStatus = "HARMONIS"
    let statusColor = "text-tertiary"
    let statusBg = "bg-tertiary/10 border-tertiary/20"
    
    if (filteredSurveys.length > 0) {
      const latestSurvey = filteredSurveys[0]
      if (latestSurvey.relationship_rating === "Kurang Baik" || latestSurvey.relationship_rating === "Kurang Harmonis") {
        latestStatus = "KURANG HARMONIS"
        statusColor = "text-error"
        statusBg = "bg-error/10 border-error/20"
      }
    } else if (filteredInteractions.length > 0) {
      const latestInt = filteredInteractions[0]
      if (latestInt.status === "Kurang Harmonis") {
        latestStatus = "KURANG HARMONIS"
        statusColor = "text-error"
        statusBg = "bg-error/10 border-error/20"
      }
    }

    let periodLabel = "Semua Periode"
    if (selectedYear !== "Semua" || selectedMonth !== "Semua") {
      const monthPart = selectedMonth !== "Semua" ? selectedMonth + " " : ""
      const yearPart = selectedYear !== "Semua" ? selectedYear : ""
      periodLabel = `${monthPart}${yearPart}`
    } else if (surveys.length > 0) {
      periodLabel = `Terakhir: ${surveys[0].month} ${surveys[0].year}`
    } else if (interactions.length > 0) {
      periodLabel = `Terakhir: ${interactions[0].bulan} ${interactions[0].tahun}`
    }

    return {
      totalInteractions,
      avgCompliance,
      attendanceRate,
      latestStatus,
      statusColor,
      statusBg,
      totalMeetingsInvited,
      meetingsAttended,
      periodLabel,
      filteredSurveys,
      filteredInteractions
    }
  }, [surveys, interactions, attendance, selectedYear, selectedMonth])

  if (profileLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant/40">Memuat Portal...</p>
        </div>
      </div>
    )
  }

  if (profile?.role !== 'stakeholder') {
    return (
      <div className="p-8">
        <div className="bg-error/5 border border-error/20 p-8 rounded-[2.5rem] text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-error mb-4">Akses Ditolak</h2>
          <p className="text-on-surface-variant font-medium">Halaman ini hanya dapat diakses oleh akun KKKS (Stakeholder).</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-10 max-w-[1400px] mx-auto min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
              Portal Stakeholder
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-tertiary animate-pulse" />
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Sesi Aktif</span>
          </div>
          <h1 className="text-4xl font-heading font-extrabold text-on-background tracking-tight">
            Selamat Datang, <span className="text-primary">{profile?.full_name || 'Rekan Stakeholder'}</span>
          </h1>
          <p className="text-on-surface-variant font-medium mt-2 max-w-xl">
            Pantau ringkasan hubungan kerja sama, riwayat interaksi, dan hasil evaluasi performa <strong className="font-bold text-on-surface">{stakeholder?.name || 'KKKS'}</strong>.
          </p>
        </div>
        
        <div className={cn("p-4 rounded-2xl border flex items-center gap-4 transition-colors", metrics.statusBg)}>
          <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center bg-white shadow-sm", metrics.statusColor)}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60">Status ({metrics.periodLabel})</p>
            <p className={cn("text-lg font-black uppercase", metrics.statusColor)}>{metrics.latestStatus}</p>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant/10 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <Filter className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-tight">Filter Periode</span>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant">Tahun:</span>
            <select 
              className="bg-white border border-outline-variant/10 rounded-xl px-4 py-2 text-xs font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option>Semua</option>
              <option>2024</option>
              <option>2025</option>
              <option>2026</option>
            </select>
          </div>

          {/* Month Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant">Bulan:</span>
            <select 
              className="bg-white border border-outline-variant/10 rounded-xl px-4 py-2 text-xs font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option>Semua</option>
              <option>Januari</option>
              <option>Februari</option>
              <option>Maret</option>
              <option>April</option>
              <option>Mei</option>
              <option>Juni</option>
              <option>Juli</option>
              <option>Agustus</option>
              <option>September</option>
              <option>Oktober</option>
              <option>November</option>
              <option>Desember</option>
            </select>
          </div>

          {/* Reset button */}
          <button 
            onClick={() => { setSelectedYear("Semua"); setSelectedMonth("Semua"); }}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-high hover:bg-outline-variant/20 rounded-xl text-xs font-bold text-on-surface transition-all cursor-pointer active:scale-95"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Tingkat Kepatuhan"
          value={`${metrics.avgCompliance}%`}
          subtitle="Berdasarkan log interaksi terbaru"
          icon={FileText}
          color="tertiary"
        />
        <MetricCard 
          title="Kehadiran Rapat"
          value={metrics.totalMeetingsInvited > 0 ? `${metrics.attendanceRate}%` : "-"}
          subtitle={metrics.totalMeetingsInvited > 0 ? `${metrics.meetingsAttended} dari ${metrics.totalMeetingsInvited} rapat` : "Belum ada agenda rapat"}
          icon={Calendar}
          color="tertiary"
        />
        <MetricCard 
          title="Jumlah Interaksi"
          value={metrics.totalInteractions.toString()}
          subtitle="Aktivitas koordinasi tercatat"
          icon={MessageSquare}
          color="primary"
        />
      </div>

      {/* Trend & Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Progress Chart/Trend */}
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-surface-container-lowest rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <TrendingUp size={120} />
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-heading font-extrabold text-on-background">Tren Evaluasi Kepatuhan</h3>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Perkembangan tingkat kepatuhan berdasarkan survei per periode.</p>
            </div>

            <div className="space-y-6 pt-4">
              {metrics.filteredSurveys.length > 0 ? (
                metrics.filteredSurveys.slice(0, 4).map((survey) => (
                  <div key={survey.id} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-on-surface">
                      <span>{survey.month} {survey.year}</span>
                      <span className="text-primary">{survey.compliance}</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          survey.compliance === "Sangat Patuh" || survey.compliance === "Patuh" 
                            ? "bg-tertiary" 
                            : "bg-primary"
                        )}
                        style={{ 
                          width: survey.compliance === "Sangat Patuh" 
                            ? "100%" 
                            : survey.compliance === "Patuh" 
                            ? "85%" 
                            : "60%" 
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-on-surface-variant/40 font-bold uppercase tracking-widest text-[10px]">
                  Belum ada data evaluasi kepatuhan.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Recent Activity Logs */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-surface-container-lowest rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm relative overflow-hidden">
            <div className="mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-heading font-extrabold text-on-background">Log Aktivitas Terbaru</h3>
            </div>

            <div className="space-y-4">
              {metrics.filteredInteractions.length > 0 ? (
                metrics.filteredInteractions.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-4 bg-surface-container rounded-2xl border border-transparent flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-0.5 rounded bg-white text-[9px] font-black text-primary border border-primary/10 uppercase">
                        {item.jenis_interaksi || "Interaksi"}
                      </span>
                      <span className="text-[10px] font-bold text-on-surface-variant/40">
                        {item.bulan} {item.tahun}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-on-surface">{item.detail_aktivitas || "-"}</p>
                    {item.keterangan && (
                      <p className="text-[10px] text-on-surface-variant/60 italic mt-1 border-t border-outline-variant/5 pt-1">
                        Ket: {item.keterangan}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-on-surface-variant/40 font-bold uppercase tracking-widest text-[10px]">
                  Belum ada catatan aktivitas interaksi.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
