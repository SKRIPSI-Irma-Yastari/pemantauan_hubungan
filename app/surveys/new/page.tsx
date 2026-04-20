"use client"

import { useState } from "react"
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  Star, 
  ChevronRight, 
  Save, 
  X,
  CheckCircle2,
  Info
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function SurveyInputForm() {
  const [kkks, setKkks] = useState("")
  const [year, setYear] = useState("2024")
  const [month, setMonth] = useState("")
  const [compliance, setCompliance] = useState("")
  const [attendance, setAttendance] = useState("")
  const [responseSpeed, setResponseSpeed] = useState("")
  const [relationshipRating, setRelationshipRating] = useState("")

  return (
    <div className="p-8 pb-20 max-w-[1000px] mx-auto min-h-screen">
      {/* Breadcrumb & Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-3">
          <span>Submission Portal</span>
          <ChevronRight className="h-3 w-3" />
          <span className="opacity-50">Survey Input</span>
        </div>
        <h1 className="text-4xl font-heading font-extrabold text-on-background tracking-tighter mb-4">Survey Input Form</h1>
        <p className="text-on-surface-variant font-medium text-sm leading-relaxed max-w-2xl opacity-80">
          Input operational performance metrics for Kontraktor Kontrak Kerja Sama (KKKS). Ensure all data reflects the sovereign clarity of regional operations.
        </p>
      </motion.div>

      {/* Main Form */}
      <form className="space-y-8">
        {/* Section 1: Entity Identification */}
        <section className="p-10 bg-surface-container-low rounded-3xl border border-outline-variant/5 shadow-sm">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
              <Building2 className="h-3 w-3" /> Nama Stakeholder KKKS
            </label>
            <select 
              value={kkks}
              onChange={(e) => setKkks(e.target.value)}
              className="w-full h-12 bg-surface-container border-none rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            >
              <option value="">Select KKKS Entity</option>
              <option value="PT Medco E&P Malaka">PT Medco E&P Malaka</option>
              <option value="PT Pema Global Energi (PGE)">PT Pema Global Energi (PGE)</option>
              <option value="Triangle Pase">Triangle Pase</option>
              <option value="Conrad Asia Energy">Conrad Asia Energy</option>
              <option value="Zaratex N.V">Zaratex N.V</option>
            </select>
          </div>
        </section>

        {/* Section 2: Temporal Parameters */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-surface-container-low rounded-3xl border border-outline-variant/5 shadow-sm">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
              <Calendar className="h-3 w-3" /> Tahun Pelaporan
            </label>
            <select 
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full h-12 bg-surface-container border-none rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
              <Clock className="h-3 w-3" /> Bulan Pelaporan
            </label>
            <select 
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full h-12 bg-surface-container border-none rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            >
              <option value="">Select Month</option>
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Section 3: Performance Metrics (Radio) */}
        <section className="p-10 bg-surface-container-lowest rounded-3xl border-2 border-primary/5 shadow-xl shadow-primary/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            <CheckCircle2 size={120} />
          </div>

          <div className="mb-8">
            <label className="block text-[11px] font-extrabold text-primary uppercase tracking-[0.2em] mb-1">Kepatuhan Laporan</label>
            <p className="text-xs text-on-surface-variant/70 font-medium">Reporting compliance based on deadlines.</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {["Sangat Patuh", "Cukup Patuh", "Kurang Patuh"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCompliance(option)}
                className={cn(
                  "px-6 py-3 rounded-2xl text-sm font-bold transition-all border-2",
                  compliance === option 
                    ? "bg-primary text-on-primary border-primary shadow-lg shadow-primary/20 scale-105" 
                    : "bg-surface-container text-on-surface-variant/60 border-transparent hover:border-primary/20"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </section>

        {/* Section 4: Qualitative Inputs */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-10 bg-surface-container-low rounded-3xl space-y-6 border border-outline-variant/5">
            <label className="block text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Kehadiran Rapat</label>
            <div className="flex flex-col gap-3">
              {["Selalu Hadir", "Kadang Hadir", "Jarang Hadir"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAttendance(option)}
                  className={cn(
                    "w-full px-6 py-4 rounded-xl text-left text-sm font-bold transition-all border-2",
                    attendance === option 
                      ? "bg-primary/10 text-primary border-primary" 
                      : "bg-surface-container/50 text-on-surface-variant/60 border-transparent hover:bg-surface-container"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="p-10 bg-surface-container-low rounded-3xl space-y-6 border border-outline-variant/5">
            <label className="block text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Kecepatan Respons Komunikasi</label>
            <div className="flex flex-col gap-3">
              {["Sangat Cepat", "Cukup Cepat", "Lambat"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setResponseSpeed(option)}
                  className={cn(
                    "w-full px-6 py-4 rounded-xl text-left text-sm font-bold transition-all border-2",
                    responseSpeed === option 
                      ? "bg-secondary/10 text-secondary border-secondary" 
                      : "bg-surface-container/50 text-on-surface-variant/60 border-transparent hover:bg-surface-container"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Relationship Evaluation (Qualitative) */}
        <section className="p-10 bg-surface-container-low rounded-3xl border border-outline-variant/5">
          <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em] mb-6">Penilaian Hubungan Kerja Sama</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["Sangat Baik", "Cukup", "Kurang Baik"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setRelationshipRating(option)}
                className={cn(
                  "p-6 rounded-2xl text-center transition-all duration-300 border-2",
                  relationshipRating === option 
                    ? "bg-primary text-on-primary border-primary shadow-xl scale-105" 
                    : "bg-surface-container text-on-surface-variant/40 border-transparent hover:border-primary/20"
                )}
              >
                <div className="text-sm font-bold uppercase tracking-wider mb-2">{option}</div>
                {option === "Sangat Baik" && <Star className="mx-auto fill-current" size={20} />}
                {option === "Cukup" && <CheckCircle2 className="mx-auto" size={20} />}
                {option === "Kurang Baik" && <Info className="mx-auto" size={20} />}
              </button>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-10">
          <Link href="/surveys">
            <button className="px-10 py-3.5 rounded-full text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-95">
              Cancel
            </button>
          </Link>
          <button className="flex items-center gap-3 px-12 py-4 rounded-full bg-primary text-on-primary font-heading font-extrabold text-sm shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
            <Save className="h-4 w-4" />
            Submit Institutional Data
          </button>
        </div>
      </form>

      {/* Footer Info */}
      <footer className="mt-20 pt-10 border-t border-outline-variant/10 flex flex-col items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/30">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          <span>Institutional Compliance & Transparency Engine © 2024</span>
        </div>
      </footer>
    </div>
  )
}
