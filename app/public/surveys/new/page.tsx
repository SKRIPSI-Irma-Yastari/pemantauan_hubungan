"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  Star, 
  ChevronRight, 
  Save, 
  Home,
  CheckCircle2,
  Info,
  Loader2,
  AlertCircle,
  ArrowRight,
  Globe
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function PublicSurveyPage() {
  const router = useRouter()
  
  // Form State
  const [kkks, setKkks] = useState("")
  const [year, setYear] = useState("2024")
  const [month, setMonth] = useState("")
  const [compliance, setCompliance] = useState("")
  const [attendance, setAttendance] = useState("")
  const [responseSpeed, setResponseSpeed] = useState("")
  const [relationshipRating, setRelationshipRating] = useState("")
  
  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic Validation
    if (!kkks || !month || !compliance || !attendance || !responseSpeed || !relationshipRating) {
      setStatus({ type: 'error', message: "Please fill in all required fields before submitting." })
      return
    }

    setIsSubmitting(true)
    setStatus({ type: null, message: "" })

    try {
      const { error } = await supabase
        .from('surveys')
        .insert([
          { 
            kkks, 
            year: year, 
            month, 
            compliance, 
            attendance, 
            response_speed: responseSpeed, 
            relationship_rating: relationshipRating 
          }
        ])

      if (error) throw error

      setIsSuccess(true)
      setStatus({ type: 'success', message: "Survey data successfully submitted." })
      
    } catch (err: any) {
      console.error("Submission Error:", err)
      setStatus({ type: 'error', message: err.message || "An error occurred while submitting the data. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-surface-container-low border border-outline-variant/10 p-12 rounded-[2.5rem] shadow-2xl shadow-primary/5 text-center space-y-8"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
            <CheckCircle2 size={48} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-heading font-extrabold text-on-background tracking-tight">Terima Kasih!</h2>
            <p className="text-on-surface-variant font-medium text-sm leading-relaxed">
              Data survey Anda telah berhasil dikirimkan ke dalam sistem pemantauan hubungan kerja sama. Kontribusi Anda sangat berharga bagi transparansi operasional.
            </p>
          </div>
          <Link href="/">
            <button className="w-full mt-4 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-primary text-on-primary font-heading font-extrabold text-sm shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
              <Home size={18} />
              Kembali ke Beranda
            </button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none isolate">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl opacity-50" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-outline-variant/5">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
              <Globe size={20} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary leading-tight">Siperta</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/40 leading-tight">Public Portal</p>
            </div>
          </div>
          <Link href="/">
            <button className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
              <Home size={14} />
              Home
            </button>
          </Link>
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-6 py-16 md:py-24 space-y-16">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-[10px] font-bold tracking-[0.2em] text-primary uppercase mx-auto md:mx-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Formulir Survey II
          </div>
          <h1 className="text-5xl md:text-6xl font-heading font-extrabold text-on-background tracking-tighter leading-none">
            Evaluasi Hubungan <span className="text-primary">Kerja Sama</span>
          </h1>
          <p className="text-on-surface-variant font-medium text-lg leading-relaxed max-w-2xl opacity-80 mx-auto md:mx-0">
            Platform terbuka untuk pengumpulan data indikator hubungan kerja sama antara stakeholder dengan instansi. Masukan Anda membantu kami meningkatkan transparansi dan efisiensi operasional.
          </p>
        </motion.div>

        {/* Status Messages */}
        <AnimatePresence>
          {status.type === 'error' && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="bg-error/5 border border-error/20 text-error rounded-3xl p-6 flex items-center gap-4 shadow-xl shadow-error/5"
            >
              <AlertCircle className="shrink-0" />
              <span className="text-sm font-bold">{status.message}</span>
              <button 
                onClick={() => setStatus({ type: null, message: "" })}
                className="ml-auto p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form Container */}
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1: Entity Identification */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-10 bg-surface-container-low/50 backdrop-blur-sm rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-8"
          >
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                <Building2 className="h-4 w-4" /> 01. Identitas Stakeholder
              </label>
              <div className="relative group">
                <select 
                  value={kkks}
                  onChange={(e) => setKkks(e.target.value)}
                  className="w-full h-16 bg-surface-container/50 border-2 border-transparent rounded-[1.25rem] px-6 text-base font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none appearance-none cursor-pointer"
                  disabled={isSubmitting}
                >
                  <option value="">Pilih Entitas KKKS</option>
                  <option value="PT Medco E&P Malaka">PT Medco E&P Malaka</option>
                  <option value="PT Pema Global Energi (PGE)">PT Pema Global Energi (PGE)</option>
                  <option value="Triangle Pase">Triangle Pase</option>
                  <option value="Conrad Asia Energy">Conrad Asia Energy</option>
                  <option value="Zaratex N.V">Zaratex N.V</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/40">
                  <ChevronRight className="h-5 w-5 rotate-90" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-[0.2em]">
                  <Calendar className="h-4 w-4" /> Tahun Pelaporan
                </label>
                <select 
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full h-14 bg-surface-container/50 border-2 border-transparent rounded-2xl px-6 text-sm font-bold focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all outline-none appearance-none"
                  disabled={isSubmitting}
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-[0.2em]">
                  <Clock className="h-4 w-4" /> Bulan Pelaporan
                </label>
                <select 
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full h-14 bg-surface-container/50 border-2 border-transparent rounded-2xl px-6 text-sm font-bold focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all outline-none appearance-none"
                  disabled={isSubmitting}
                >
                  <option value="">Pilih Bulan</option>
                  {[
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                  ].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.section>

          {/* Section 2: Performance Metrics */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-0.5 flex-1 bg-outline-variant/10" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Parameter Kinerja</span>
              <div className="h-0.5 flex-1 bg-outline-variant/10" />
            </div>

            {/* Metric 1 */}
            <div className="p-10 bg-surface-container-lowest border border-outline-variant/10 rounded-[2.5rem] shadow-xl shadow-primary/5 group relative overflow-hidden">
               <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
               <div className="relative space-y-8">
                <div>
                  <h3 className="text-xl font-heading font-extrabold text-on-background tracking-tight">Kepatuhan Laporan</h3>
                  <p className="text-sm text-on-surface-variant font-medium opacity-60">Seberapa patuh entitas dalam mengirimkan laporan operasional sesuai tenggat waktu?</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {["Sangat Patuh", "Cukup Patuh", "Kurang Patuh"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setCompliance(option)}
                      disabled={isSubmitting}
                      className={cn(
                        "flex-1 min-w-[200px] px-8 py-5 rounded-[1.5rem] text-sm font-bold transition-all border-2",
                        compliance === option 
                          ? "bg-primary text-on-primary border-primary shadow-xl shadow-primary/20 scale-[1.02]" 
                          : "bg-surface-container/50 text-on-surface-variant/40 border-transparent hover:border-primary/20 hover:bg-surface-container"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Metric 2 */}
              <div className="p-10 bg-surface-container-low/50 rounded-[2.5rem] border border-outline-variant/10 space-y-8">
                <div>
                  <h3 className="text-lg font-heading font-extrabold text-on-background tracking-tight">Kehadiran Rapat</h3>
                  <p className="text-xs text-on-surface-variant font-medium opacity-60">Intensitas kehadiran dalam koordinasi teknis.</p>
                </div>
                <div className="grid gap-3">
                  {["Selalu Hadir", "Kadang Hadir", "Jarang Hadir"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setAttendance(option)}
                      disabled={isSubmitting}
                      className={cn(
                        "w-full px-6 py-4 rounded-2xl text-left text-sm font-bold transition-all border-2",
                        attendance === option 
                          ? "bg-primary/10 text-primary border-primary" 
                          : "bg-surface-container/30 text-on-surface-variant/40 border-transparent hover:bg-surface-container"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metric 3 */}
              <div className="p-10 bg-surface-container-low/50 rounded-[2.5rem] border border-outline-variant/10 space-y-8">
                <div>
                  <h3 className="text-lg font-heading font-extrabold text-on-background tracking-tight">Respons Komunikasi</h3>
                  <p className="text-xs text-on-surface-variant font-medium opacity-60">Kecepatan dalam menanggapi kueri dan surat menyurat.</p>
                </div>
                <div className="grid gap-3">
                  {["Sangat Cepat", "Cukup Cepat", "Lambat"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setResponseSpeed(option)}
                      disabled={isSubmitting}
                      className={cn(
                        "w-full px-6 py-4 rounded-2xl text-left text-sm font-bold transition-all border-2",
                        responseSpeed === option 
                          ? "bg-secondary/10 text-secondary border-secondary" 
                          : "bg-surface-container/30 text-on-surface-variant/40 border-transparent hover:bg-surface-container"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Section 3: Final Rating */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-12 bg-surface-container-lowest border-2 border-primary/10 rounded-[3rem] shadow-2xl shadow-primary/5 text-center space-y-10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            
            <div className="max-w-xl mx-auto space-y-2">
              <label className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Evaluasi Akhir</label>
              <h3 className="text-3xl font-heading font-extrabold text-on-background tracking-tighter">Bagaimana penilaian Anda terhadap hubungan kerja sama ini secara keseluruhan?</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: "Sangat Baik", icon: <Star className="fill-current" /> },
                { label: "Cukup", icon: <CheckCircle2 /> },
                { label: "Kurang Baik", icon: <AlertCircle /> }
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setRelationshipRating(item.label)}
                  disabled={isSubmitting}
                  className={cn(
                    "p-8 rounded-[2rem] flex flex-col items-center gap-4 transition-all duration-500 border-2",
                    relationshipRating === item.label 
                      ? "bg-primary text-on-primary border-primary shadow-2xl scale-105" 
                      : "bg-surface-container/50 text-on-surface-variant/20 border-transparent hover:border-primary/20 hover:scale-[1.02]"
                  )}
                >
                  <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center transition-colors",
                    relationshipRating === item.label ? "bg-white/20" : "bg-surface-container text-on-surface-variant/20"
                  )}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest leading-none">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.section>

          {/* Final Action */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-8 pt-8"
          >
            <div className="flex items-center gap-3 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.2em]">
              <Info className="h-4 w-4" />
              Pastikan seluruh data yang diinput telah sesuai dengan fakta lapangan
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="group relative flex items-center gap-4 px-16 py-6 rounded-full bg-primary text-on-primary font-heading font-black text-lg shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.5)] hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Save className="h-6 w-6" />
              )}
              
              <span className="relative">
                {isSubmitting ? "Mengirim Data..." : "Kirim Laporan Survey"}
              </span>
              <ArrowRight className="h-5 w-5 opacity-40 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </form>

        {/* Footer */}
        <footer className="pt-20 pb-10 flex flex-col items-center gap-6 border-t border-outline-variant/10">
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/20">
            <span className="hover:text-primary transition-colors cursor-pointer">Panduan Penggunaan</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Kontak Support</span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/30">
            <span>© 2024 Institutional Compliance & Transparency Engine</span>
            <span className="h-1 w-1 rounded-full bg-on-surface-variant/20" />
            <span className="text-primary/40 text-[10px] tracking-[0.2em]">Aceh Energy Monitoring</span>
          </div>
        </footer>
      </main>

      {/* Decorative Blur */}
      <div className="fixed -bottom-48 -left-48 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
    </div>
  )
}

function X({ size = 24, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  )
}
