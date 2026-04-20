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
  const [compliance, setCompliance] = useState(85)
  const [rating, setRating] = useState(4)
  const [hoverRating, setHoverRating] = useState(0)

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
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-surface-container-low rounded-3xl border border-outline-variant/5 shadow-sm">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
              <Building2 className="h-3 w-3" /> Nama Stakeholder KKKS
            </label>
            <select className="w-full h-12 bg-surface-container border-none rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none">
              <option>Select KKKS Entity</option>
              <option>Pertamina EP</option>
              <option>Medco E&P Malaka</option>
              <option>Mubadala Energy</option>
              <option>Triangle Pase</option>
            </select>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
              <MapPin className="h-3 w-3" /> Wilayah Operasional
            </label>
            <select className="w-full h-12 bg-surface-container border-none rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none">
              <option>Select Region</option>
              <option>Aceh Timur</option>
              <option>Aceh Utara</option>
              <option>Aceh Tamiang</option>
              <option>Pidie Jaya</option>
              <option>Bireuen</option>
            </select>
          </div>
        </section>

        {/* Section 2: Temporal Parameters */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-surface-container-low rounded-3xl border border-outline-variant/5 shadow-sm">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
              <Calendar className="h-3 w-3" /> Tahun Pelaporan
            </label>
            <select className="w-full h-12 bg-surface-container border-none rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none">
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
            </select>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
              <Clock className="h-3 w-3" /> Bulan Pelaporan
            </label>
            <select className="w-full h-12 bg-surface-container border-none rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none">
              <option>Januari</option>
              <option>Februari</option>
              <option>Maret</option>
              <option>April</option>
            </select>
          </div>
        </section>

        {/* Section 3: Performance Metrics (Slider) */}
        <section className="p-10 bg-surface-container-lowest rounded-3xl border-2 border-primary/5 shadow-xl shadow-primary/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            <CheckCircle2 size={120} />
          </div>

          <div className="flex justify-between items-end mb-8">
            <div>
              <label className="block text-[11px] font-extrabold text-primary uppercase tracking-[0.2em] mb-1">Kepatuhan Laporan</label>
              <p className="text-xs text-on-surface-variant/70 font-medium">Percentage of reporting deadlines met within the cycle.</p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-heading font-extrabold text-primary">{compliance}</span>
              <span className="text-xl font-bold text-primary/40 ml-1">%</span>
            </div>
          </div>
          
          <div className="relative h-12 flex items-center group">
            <input 
              type="range"
              min="0"
              max="100"
              value={compliance}
              onChange={(e) => setCompliance(parseInt(e.target.value))}
              className="w-full h-2 bg-surface-container rounded-full appearance-none cursor-pointer accent-primary hover:accent-secondary transition-all"
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] font-bold text-on-surface-variant/30 uppercase">Minimal</span>
            <span className="text-[10px] font-bold text-primary/60 uppercase">Target: 85%+</span>
            <span className="text-[10px] font-bold text-on-surface-variant/30 uppercase">Optimal</span>
          </div>
        </section>

        {/* Section 4: Quantitative Input */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-10 bg-surface-container-low rounded-3xl space-y-4 border border-outline-variant/5">
            <label className="block text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Kehadiran Rapat</label>
            <div className="relative flex items-center">
              <input 
                type="number"
                placeholder="0"
                className="w-full h-14 bg-surface-container border-none rounded-2xl px-6 text-xl font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-24"
              />
              <span className="absolute right-6 text-[10px] font-bold text-on-surface-variant/40 tracking-widest uppercase">Sessions</span>
            </div>
          </div>
          <div className="p-10 bg-surface-container-low rounded-3xl space-y-4 border border-outline-variant/5">
            <label className="block text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Respons Komunikasi</label>
            <div className="relative flex items-center">
              <input 
                type="number"
                placeholder="0"
                className="w-full h-14 bg-surface-container border-none rounded-2xl px-6 text-xl font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-20"
              />
              <span className="absolute right-6 text-[10px] font-bold text-on-surface-variant/40 tracking-widest uppercase">Days</span>
            </div>
          </div>
        </section>

        {/* Section 5: Relationship Evaluation (Stars) */}
        <section className="p-10 bg-surface-container-low rounded-3xl border border-outline-variant/5">
          <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em] mb-6">Penilaian Hubungan Kerja Sama</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <div className="flex gap-2 p-1 bg-surface-container rounded-2xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-3 rounded-xl transition-all duration-300"
                >
                  <Star 
                    size={28} 
                    className={cn(
                      "transition-all duration-300",
                      (hoverRating || rating) >= star 
                        ? "fill-primary text-primary drop-shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.2)]" 
                        : "text-on-surface-variant/20 hover:text-primary/40"
                    )} 
                  />
                </button>
              ))}
            </div>
            <div>
              <p className="text-xl font-heading font-extrabold text-primary">
                {rating === 5 && "Institutional Standard"}
                {rating === 4 && "Strong Institutional Alignment"}
                {rating === 3 && "Stable Collaboration"}
                {rating === 2 && "Minor Friction"}
                {rating === 1 && "Critical Review Required"}
              </p>
              <p className="text-xs font-medium text-on-surface-variant mt-1 opacity-60 italic">Current rating based on historical qualitative data.</p>
            </div>
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
