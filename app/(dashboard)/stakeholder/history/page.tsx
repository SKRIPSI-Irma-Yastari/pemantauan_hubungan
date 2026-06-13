"use client"

import { useEffect, useState, useMemo } from "react"
import { 
  Calendar, 
  Search, 
  FileText, 
  MessageSquare,
  Filter,
  RefreshCw,
  Info
} from "lucide-react"
import { useProfile } from "@/hooks/use-profile"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

export default function StakeholderHistory() {
  const { profile, loading: profileLoading } = useProfile()
  const [stakeholder, setStakeholder] = useState<any>(null)
  const [surveys, setSurveys] = useState<any[]>([])
  const [interactions, setInteractions] = useState<any[]>([])
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

        // Fetch stakeholder details
        const shRes = await supabase
          .from('stakeholders')
          .select('*')
          .eq('id', profile.stakeholder_id)
          .single()
        
        if (shRes.error) throw shRes.error
        setStakeholder(shRes.data)

        const shName = shRes.data.name

        // Fetch surveys and interaction data in parallel
        const [surveysRes, interactionsRes] = await Promise.all([
          supabase.from('surveys').select('*').eq('kkks', shName).order('year', { ascending: false }).order('month', { ascending: false }),
          supabase.from('interaction_data').select('*').eq('stakeholder_id', profile.stakeholder_id).order('created_at', { ascending: false })
        ])

        setSurveys(surveysRes.data || [])
        setInteractions(interactionsRes.data || [])
      } catch (err) {
        console.error("Error fetching stakeholder history data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [profile, profileLoading])

  // Filtered surveys
  const filteredSurveys = useMemo(() => {
    return surveys.filter(s => {
      const matchYear = selectedYear === "Semua" || s.year.toString() === selectedYear
      const matchMonth = selectedMonth === "Semua" || s.month.toLowerCase() === selectedMonth.toLowerCase()
      return matchYear && matchMonth
    })
  }, [surveys, selectedYear, selectedMonth])

  // Filtered interactions
  const filteredInteractions = useMemo(() => {
    return interactions.filter(i => {
      const matchYear = selectedYear === "Semua" || i.tahun.toString() === selectedYear
      const matchMonth = selectedMonth === "Semua" || i.bulan.toLowerCase() === selectedMonth.toLowerCase()
      return matchYear && matchMonth
    })
  }, [interactions, selectedYear, selectedMonth])

  if (profileLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant/40">Memuat Riwayat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-10 max-w-[1400px] mx-auto min-h-screen">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
            Riwayat Klasifikasi & Interaksi
          </span>
        </div>
        <h1 className="text-4xl font-heading font-extrabold text-on-background tracking-tight">
          Riwayat Data
        </h1>
        <p className="text-on-surface-variant font-medium mt-2 max-w-xl">
          Lihat kembali data evaluasi periodik dan catatan aktivitas koordinasi **{stakeholder?.name}** yang telah diverifikasi oleh BPMA.
        </p>
      </div>

      {/* Filter Panel */}
      <div className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant/10 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <Filter className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-tight">Filter Riwayat</span>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant">Tahun:</span>
            <select 
              className="bg-white border border-outline-variant/10 rounded-xl px-4 py-2 text-xs font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option>Semua</option>
              <option>2023</option>
              <option>2024</option>
              <option>2025</option>
              <option>2026</option>
              <option>2027</option>
            </select>
          </div>

          {/* Month Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant">Bulan:</span>
            <select 
              className="bg-white border border-outline-variant/10 rounded-xl px-4 py-2 text-xs font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-high hover:bg-outline-variant/20 rounded-xl text-xs font-bold text-on-surface transition-all"
          >
            <RefreshCw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </div>

      {/* History Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Classification History (Surveys) */}
        <section className="bg-surface-container-lowest rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="text-lg font-heading font-extrabold text-on-background">Riwayat Hasil Klasifikasi</h3>
              <p className="text-xs text-on-surface-variant font-medium">Histori status keharmonisan dari survei evaluasi periodik.</p>
            </div>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {filteredSurveys.length > 0 ? (
              filteredSurveys.map(s => {
                const isHarmonious = s.relationship_rating === "Sangat Baik" || s.relationship_rating === "Cukup" || s.relationship_rating === "Harmonis"
                return (
                  <div key={s.id} className="p-5 bg-surface-container rounded-2xl border border-transparent flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-on-surface">{s.month} {s.year}</p>
                        <p className="text-[10px] text-on-surface-variant font-medium">Evaluasi Kepatuhan: {s.compliance}</p>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border",
                        isHarmonious 
                          ? "bg-tertiary/10 text-tertiary border-tertiary/20" 
                          : "bg-error/10 text-error border-error/20"
                      )}>
                        {isHarmonious ? "Harmonis" : "Kurang Harmonis"}
                      </span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-10 text-on-surface-variant/40 font-bold uppercase tracking-widest text-[10px]">
                Tidak ada data riwayat klasifikasi.
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Interaction History (Logs) */}
        <section className="bg-surface-container-lowest rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
            <div>
              <h3 className="text-lg font-heading font-extrabold text-on-background">Riwayat Log Interaksi</h3>
              <p className="text-xs text-on-surface-variant font-medium">Daftar log aktivitas koordinasi yang tercatat.</p>
            </div>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {filteredInteractions.length > 0 ? (
              filteredInteractions.map(item => (
                <div key={item.id} className="p-5 bg-surface-container rounded-2xl border border-transparent flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="px-2.5 py-0.5 rounded bg-white text-[9px] font-black text-primary border border-primary/10 uppercase">
                      {item.jenis_interaksi || "Interaksi"}
                    </span>
                    <span className="text-[10px] font-bold text-on-surface-variant/40">
                      {item.bulan} {item.tahun}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-on-surface leading-normal">{item.detail_aktivitas || "-"}</p>
                  {item.keterangan && (
                    <div className="mt-2 text-[10px] text-on-surface-variant/60 border-t border-outline-variant/5 pt-1.5 flex gap-1">
                      <span className="font-bold flex-shrink-0">Catatan:</span>
                      <span>{item.keterangan}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-on-surface-variant/40 font-bold uppercase tracking-widest text-[10px]">
                Tidak ada data riwayat log interaksi.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
