"use client"

import { useState, useEffect } from "react"
import { 
  UploadCloud, 
  CalendarDays, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  Archive,
  ArrowRight,
  ChevronDown,
  Loader2,
  AlertCircle,
  Building2,
  FileText
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useProfile } from "@/hooks/use-profile"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

export default function StakeholderReportsPage() {
  const { profile, loading: profileLoading } = useProfile()
  const [meetings, setMeetings] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form State
  const [reportType, setReportType] = useState("Laporan Bulanan")
  const [period, setPeriod] = useState("Maret 2024")
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: "" })

  useEffect(() => {
    if (!profileLoading && profile?.stakeholder_id) {
      fetchPageData()
    }
  }, [profile, profileLoading])

  const fetchPageData = async () => {
    try {
      setIsLoading(true)
      const [meetingsRes, reportsRes] = await Promise.all([
        supabase.from('meetings').select('*, attendance(id)').eq('attendance.stakeholder_id', profile?.stakeholder_id || ''),
        supabase.from('reports').select('*').eq('stakeholder_id', profile?.stakeholder_id || '').order('submitted_at', { ascending: false })
      ])

      if (meetingsRes.error) throw meetingsRes.error
      if (reportsRes.error) throw reportsRes.error

      setMeetings(meetingsRes.data || [])
      setReports(reportsRes.data || [])
    } catch (err) {
      console.error("Error fetching data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatusMsg({ type: null, msg: "" })

    try {
      const { error } = await supabase
        .from('reports')
        .insert([{
          stakeholder_id: profile?.stakeholder_id,
          report_type: reportType,
          period: period,
          status: 'pending'
        }])

      if (error) throw error
      setStatusMsg({ type: 'success', msg: "Laporan berhasil diunggah! Menunggu verifikasi BPMA." })
      fetchPageData()
    } catch (err: any) {
      setStatusMsg({ type: 'error', msg: err.message || "Gagal mengunggah laporan." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmAttendance = async (meetingId: string) => {
    try {
      const { error } = await supabase
        .from('attendance')
        .insert([{
          meeting_id: meetingId,
          stakeholder_id: profile?.stakeholder_id,
          status: 'present'
        }])
      
      if (error) throw error
      fetchPageData()
    } catch (err) {
      console.error("Error confirming attendance:", err)
      alert("Gagal mengonfirmasi kehadiran.")
    }
  }

  if (profileLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-10 max-w-[1400px] mx-auto min-h-screen">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-on-background tracking-tight">Kepatuhan & Interaksi</h1>
        <p className="text-on-surface-variant font-medium mt-1">Kelola pengiriman laporan berkala dan konfirmasi kehadiran rapat regulasi.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Upload Form Section */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
            <h3 className="text-xl font-heading font-extrabold text-on-background mb-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <UploadCloud size={20} />
              </div>
              Unggah Laporan
            </h3>

            <form onSubmit={handleReportSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-4">Jenis Laporan</label>
                  <select 
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-6 py-3.5 bg-surface-container rounded-2xl border border-transparent focus:border-primary outline-none text-sm transition-all appearance-none"
                  >
                    <option>Laporan Bulanan</option>
                    <option>Laporan Triwulan</option>
                    <option>Laporan Semester</option>
                    <option>Laporan Insidental</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-4">Periode Laporan</label>
                  <input 
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    type="text"
                    placeholder="Contoh: Maret 2024"
                    className="w-full px-6 py-3.5 bg-surface-container rounded-2xl border border-transparent focus:border-primary outline-none text-sm transition-all"
                  />
                </div>
                
                <div className="border-2 border-dashed border-outline-variant/20 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4 hover:border-primary/40 transition-colors group cursor-pointer">
                  <div className="h-16 w-16 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant/40 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                    <FileText size={32} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-background">Klik untuk pilih file</p>
                    <p className="text-[10px] font-medium text-on-surface-variant/60">Maksimal 10MB (PDF, DOCX, XLSX)</p>
                  </div>
                </div>
              </div>

              {statusMsg.type && (
                <div className={cn(
                  "p-4 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2",
                  statusMsg.type === 'success' ? "bg-tertiary/10 text-tertiary" : "bg-error/10 text-error"
                )}>
                  {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {statusMsg.msg}
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={20} className="animate-spin mx-auto" /> : "Submit Laporan"}
              </button>
            </form>
          </section>
        </div>

        {/* Meetings List Section */}
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm h-full">
            <h3 className="text-xl font-heading font-extrabold text-on-background mb-8 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
                <CalendarDays size={20} />
              </div>
              Daftar Rapat & Agenda
            </h3>

            <div className="space-y-4">
              {meetings.length > 0 ? (
                meetings.map(meeting => {
                  const isConfirmed = meeting.attendance && meeting.attendance.length > 0;
                  return (
                    <div key={meeting.id} className="group p-6 bg-surface-container-low rounded-3xl border border-transparent hover:border-outline-variant/10 transition-all flex items-start gap-6">
                      <div className="flex flex-col items-center justify-center h-16 w-16 bg-white rounded-2xl shadow-sm text-on-surface-variant shrink-0">
                        <span className="text-[10px] font-black uppercase opacity-40">Mar</span>
                        <span className="text-2xl font-heading font-black">28</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest leading-none">REGULASI</span>
                          <span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1">
                            <Clock size={10} /> 10:00 WIB
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-on-surface mb-2 truncate">{meeting.title}</h4>
                        <p className="text-xs text-on-surface-variant/70 line-clamp-1 mb-4">{meeting.description || 'Koordinasi teknis implementasi kebijakan baru.'}</p>
                        
                        <div className="flex items-center gap-3">
                          {isConfirmed ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-tertiary/10 text-tertiary rounded-xl text-[10px] font-black uppercase tracking-widest border border-tertiary/20">
                              <CheckCircle2 size={14} /> Tuntas Direspon
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleConfirmAttendance(meeting.id)}
                              className="px-6 py-2 bg-white border border-outline-variant/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-on-primary hover:border-primary transition-all active:scale-95 shadow-sm"
                            >
                              Konfirmasi Hadir
                            </button>
                          )}
                          <button className="text-[10px] font-bold text-on-surface-variant/40 hover:text-primary transition-colors flex items-center gap-1 ml-auto">
                            DETAIL AGENDA <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-12 text-center text-on-surface-variant/40 italic text-sm">Tidak ada jadwal rapat mendatang.</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
