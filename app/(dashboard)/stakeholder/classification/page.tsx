"use client"

import { useEffect, useState, useMemo } from "react"
import { 
  ShieldCheck, 
  AlertCircle, 
  Workflow, 
  Info,
  Layers,
  Sparkles,
  GitBranch
} from "lucide-react"
import { motion } from "framer-motion"
import { useProfile } from "@/hooks/use-profile"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { StabilityGauge } from "@/components/ui/stability-gauge"

export default function StakeholderClassification() {
  const { profile, loading: profileLoading } = useProfile()
  const [stakeholder, setStakeholder] = useState<any>(null)
  const [latestSurvey, setLatestSurvey] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

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

        // Fetch latest survey of this stakeholder
        const { data: surveyData, error: surveyError } = await supabase
          .from('surveys')
          .select('*')
          .eq('kkks', shRes.data.name)
          .order('year', { ascending: false })
          .order('month', { ascending: false })
          .limit(1)

        if (surveyError) throw surveyError
        if (surveyData && surveyData.length > 0) {
          setLatestSurvey(surveyData[0])
        }
      } catch (err) {
        console.error("Error fetching stakeholder classification data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [profile, profileLoading])

  const classificationResult = useMemo(() => {
    if (!latestSurvey) return {
      status: "BELUM ADA DATA",
      color: "text-on-surface-variant/40",
      bg: "bg-surface-container-low border-outline-variant/10",
      score: 0,
      description: "Belum ada survei hubungan kerja sama terdaftar untuk periode terbaru."
    }

    const rating = latestSurvey.relationship_rating
    const isHarmonious = rating === "Sangat Baik" || rating === "Cukup" || rating === "Harmonis"

    return {
      status: isHarmonious ? "HARMONIS" : "KURANG HARMONIS",
      color: isHarmonious ? "text-tertiary" : "text-error",
      bg: isHarmonious ? "bg-tertiary/10 border-tertiary/20" : "bg-error/10 border-error/20",
      score: isHarmonious ? 92.5 : 45.0,
      description: isHarmonious 
        ? `Berdasarkan evaluasi CART untuk periode ${latestSurvey.month} ${latestSurvey.year}, hubungan kerja sama tergolong Harmonis didukung tingkat kepatuhan ${latestSurvey.compliance}.`
        : `Berdasarkan evaluasi CART untuk periode ${latestSurvey.month} ${latestSurvey.year}, hubungan kerja sama tergolong Kurang Harmonis dikarenakan parameter respon atau kepatuhan perlu ditingkatkan.`
    }
  }, [latestSurvey])

  if (profileLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant/40">Memuat Klasifikasi...</p>
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
            Hasil Klasifikasi CART
          </span>
        </div>
        <h1 className="text-4xl font-heading font-extrabold text-on-background tracking-tight">
          Hasil Klasifikasi Hubungan
        </h1>
        <p className="text-on-surface-variant font-medium mt-2 max-w-xl">
          Berikut adalah hasil pemrosesan algoritma keputusan CART terhadap indikator hubungan kerja sama untuk <strong className="font-bold text-on-surface">{stakeholder?.name || 'KKKS'}</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Status Card and Gauge */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-surface-container-lowest rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 mb-6">Status Hubungan Terakhir</h3>
            <StabilityGauge 
              score={classificationResult.score} 
              label="Indeks Kestabilan" 
              status={classificationResult.status === "HARMONIS" ? "HARMONIOUS" : "CRITICAL"} 
              className="scale-110 mb-4" 
            />
          </section>

          <div className={cn("p-6 rounded-3xl border flex flex-col gap-2", classificationResult.bg)}>
            <div className="flex items-center gap-3">
              {classificationResult.status === "HARMONIS" ? (
                <ShieldCheck className={cn("h-6 w-6", classificationResult.color)} />
              ) : (
                <AlertCircle className={cn("h-6 w-6", classificationResult.color)} />
              )}
              <span className={cn("text-lg font-black tracking-tight", classificationResult.color)}>
                {classificationResult.status}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
              {classificationResult.description}
            </p>
          </div>
        </div>

        {/* CART Decision Rules */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-surface-container-lowest rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Workflow className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-extrabold text-on-background">Aturan Keputusan CART (Decision Tree)</h3>
                <p className="text-xs text-on-surface-variant font-medium">Logika klasifikasi yang digunakan sistem untuk menilai hubungan kerja sama.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-surface-container rounded-2xl border border-outline-variant/5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black text-primary uppercase tracking-wider">Rule #01 · Jalur Hubungan Harmonis</span>
                </div>
                <div className="font-mono text-xs space-y-1 bg-white p-4 rounded-xl border border-outline-variant/10">
                  <p><span className="text-primary font-bold">IF</span> Kepatuhan Laporan = "Sangat Patuh" OR "Patuh"</p>
                  <p><span className="text-primary font-bold">AND</span> Kehadiran Rapat &gt;= 80%</p>
                  <p><span className="text-tertiary font-bold">THEN</span> STATUS = <span className="font-bold text-tertiary">HARMONIS</span></p>
                </div>
              </div>

              <div className="p-5 bg-surface-container rounded-2xl border border-outline-variant/5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black text-error uppercase tracking-wider">Rule #02 · Jalur Hubungan Kurang Harmonis</span>
                </div>
                <div className="font-mono text-xs space-y-1 bg-white p-4 rounded-xl border border-outline-variant/10">
                  <p><span className="text-primary font-bold">IF</span> Kepatuhan Laporan = "Kurang Patuh"</p>
                  <p><span className="text-primary font-bold">OR</span> Kehadiran Rapat &lt; 50%</p>
                  <p><span className="text-error font-bold">THEN</span> STATUS = <span className="font-bold text-error">KURANG HARMONIS</span></p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Parameter Info */}
      <section className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10 flex flex-col md:flex-row gap-6">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          <GitBranch className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-md font-bold text-primary mb-1 uppercase tracking-tight">Transparansi Penilaian</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed max-w-3xl">
            Sistem Pemantauan Hubungan Kerja Sama menggunakan algoritma CART yang ditraining menggunakan dataset historis BPMA. 
            Hasil klasifikasi merupakan representasi objektif dari parameter kepatuhan laporan, kehadiran koordinasi, dan kecepatan respons yang diberikan oleh pihak KKKS.
          </p>
        </div>
      </section>
    </div>
  )
}
