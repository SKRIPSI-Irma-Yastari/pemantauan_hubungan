"use client"

import { useEffect, useState } from "react"
import { 
  ShieldCheck, 
  Clock, 
  Calendar, 
  FileText, 
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  ArrowUpRight,
  CheckCircle2
} from "lucide-react"
import { motion } from "framer-motion"
import { useProfile } from "@/hooks/use-profile"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { MetricCard } from "@/components/ui/metric-card"

export default function StakeholderDashboard() {
  const { profile, loading: profileLoading } = useProfile()
  const [stakeholderData, setStakeholderData] = useState<any>(null)
  const [recentReports, setRecentReports] = useState<any[]>([])
  const [nextMeetings, setNextMeetings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!profile || profile.role !== 'stakeholder' || !profile.stakeholder_id) return

      try {
        setIsLoading(true)
        const [stakeholderRes, reportsRes, meetingsRes] = await Promise.all([
          supabase.from('stakeholders').select('*').eq('id', profile.stakeholder_id).single(),
          supabase.from('reports').select('*').eq('stakeholder_id', profile.stakeholder_id).order('submitted_at', { ascending: false }).limit(3),
          supabase.from('meetings').select('*').order('meeting_at', { ascending: true }).limit(2)
        ])

        if (stakeholderRes.data) setStakeholderData(stakeholderRes.data)
        if (reportsRes.data) setRecentReports(reportsRes.data)
        if (meetingsRes.data) setNextMeetings(meetingsRes.data)
      } catch (err) {
        console.error("Error fetching stakeholder dashboard:", err)
      } finally {
        setIsLoading(false)
      }
    }

    if (!profileLoading) {
      fetchData()
    }
  }, [profile, profileLoading])

  if (profileLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant/40">Loading Portal...</p>
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
              Stakeholder Portal
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-tertiary animate-pulse" />
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Active Session</span>
          </div>
          <h1 className="text-4xl font-heading font-extrabold text-on-background tracking-tight">
            Selamat Datang, <span className="text-primary">{profile?.full_name || 'Rekan Stakeholder'}</span>
          </h1>
          <p className="text-on-surface-variant font-medium mt-2 max-w-xl">
            Pantau status kepatuhan, jadwal rapat, dan pengiriman laporan {stakeholderData?.name} secara real-time.
          </p>
        </div>
        
        <div className="bg-surface-container-high/50 p-4 rounded-2xl border border-outline-variant/10 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Status Hubungan</p>
            <p className="text-lg font-black text-tertiary uppercase">HARMONIS</p>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Kepatuhan Laporan"
          value="95%"
          trend="+2.5%"
          icon={FileText}
          status="success"
        />
        <MetricCard 
          title="Kehadiran Rapat"
          value="12"
          trend="Sempurna"
          icon={Calendar}
          status="success"
        />
        <MetricCard 
          title="Respons Komunikasi"
          value="1.2 hr"
          trend="Sangat Cepat"
          icon={MessageSquare}
          status="success"
        />
        <MetricCard 
          title="Tugas Pending"
          value="0"
          trend="Tuntas"
          icon={AlertTriangle}
          status="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
        {/* Left Column: Reports & History */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-surface-container-lowest rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
              <TrendingUp size={120} />
            </div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-xl font-heading font-extrabold text-on-background">Riwayat Laporan Terakhir</h3>
                <p className="text-xs text-on-surface-variant font-medium mt-1">Daftar dokumen yang telah diverifikasi oleh BPMA.</p>
              </div>
              <button className="text-xs font-black text-primary hover:underline flex items-center gap-1 group">
                LIHAT SEMUA <ArrowUpRight className="h-4 w-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="space-y-4 relative z-10">
              {recentReports.length > 0 ? (
                recentReports.map(report => (
                  <div key={report.id} className="p-5 bg-surface-container-low rounded-2xl border border-transparent hover:border-outline-variant/10 transition-all flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">{report.report_type} - {report.period}</p>
                        <p className="text-[10px] text-on-surface-variant font-medium">Dikirim pada {new Date(report.submitted_at).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-bold border border-tertiary/10 uppercase">TERVERIFIKASI</span>
                      <CheckCircle2 size={18} className="text-tertiary" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-on-surface-variant/40 font-bold uppercase tracking-widest text-[10px]">Belum ada riwayat laporan.</div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Meetings */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-primary p-8 rounded-[2.5rem] text-on-primary shadow-xl shadow-primary/20 relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Calendar size={20} />
              </div>
              <h3 className="text-lg font-heading font-extrabold uppercase tracking-tight">Rapat Mendatang</h3>
            </div>

            <div className="space-y-6">
              {nextMeetings.length > 0 ? (
                nextMeetings.map(meeting => (
                  <div key={meeting.id} className="relative pl-6 border-l-2 border-white/20 pb-2">
                    <div className="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-white" />
                    <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">
                      {new Date(meeting.meeting_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                    </p>
                    <p className="font-bold text-sm leading-tight mb-2">{meeting.title}</p>
                    <div className="flex items-center gap-2 opacity-80">
                      <Clock size={12} />
                      <span className="text-[10px] font-medium">{new Date(meeting.meeting_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs font-medium opacity-60 italic">Tidak ada jadwal rapat terdekat.</p>
              )}
            </div>

            <button className="w-full mt-8 py-4 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-opacity-90 transition-all active:scale-95">
              Konfirmasi Kehadiran
            </button>
          </section>

          {/* Quick Support */}
          <div className="bg-surface-container-high rounded-[2rem] p-6 border border-outline-variant/5">
            <h4 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-4">Butuh Bantuan?</h4>
            <p className="text-xs text-on-surface-variant/70 leading-relaxed mb-6">Hubungi tim Regulator BPMA jika Anda menemukan kendala teknis atau butuh klarifikasi parameter.</p>
            <button className="flex items-center gap-3 text-xs font-bold text-primary group">
              Buka Tiket Dukungan
              <ArrowUpRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
