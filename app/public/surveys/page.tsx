"use client"

import {
  ArrowRight,
  Globe,
  Home,
  FileText,
  Activity,
  ClipboardCheck,
  ChevronRight,
  Info
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function SurveySelectorPage() {
  const surveys = [
    {
      id: "v1",
      title: "Survey I: Indikator Kinerja Operasional",
      description: "Survey mendalam mengenai kepatuhan laporan, kehadiran rapat, dan respons komunikasi stakeholder.",
      icon: <ClipboardCheck className="text-primary" />,
      href: "/public/surveys/v1",
      color: "primary"
    },
    {
      id: "v2",
      title: "Survey II: Evaluasi Hubungan Kerja Sama",
      description: "Survey ringkas mengenai penilaian kualitas hubungan kerja sama secara keseluruhan.",
      icon: <Activity className="text-secondary" />,
      href: "/public/surveys/new",
      color: "secondary"
    }
  ]

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none isolate">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl opacity-50" />
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

      <main className="max-w-[1000px] mx-auto px-6 py-20 md:py-32 space-y-16">
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-[10px] font-black tracking-[0.3em] text-primary uppercase"
          >
            Portal Survey Publik
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-heading font-extrabold text-on-background tracking-tighter leading-tight"
          >
            Pilih <span className="text-primary italic">Instrumen</span> Survey
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-on-surface-variant font-medium text-lg leading-relaxed max-w-2xl mx-auto opacity-70"
          >
            Silakan pilih jenis survey yang ingin Anda isi. Masukan Anda sangat berharga bagi peningkatan tata kelola industri energi di Aceh.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {surveys.map((survey, i) => (
            <motion.div
              key={survey.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Link href={survey.href} className="block group">
                <div className="h-full p-10 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/10 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                  <div className={cn(
                    "absolute -right-8 -bottom-8 opacity-5 group-hover:scale-110 transition-transform duration-700",
                    survey.color === "primary" ? "text-primary" : "text-secondary"
                  )}>
                    {survey.icon && <div className="scale-[5]">{survey.icon}</div>}
                  </div>

                  <div className="relative space-y-6">
                    <div className={cn(
                      "h-16 w-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-500",
                      survey.color === "primary" ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-on-primary" : "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-on-secondary"
                    )}>
                      {survey.icon}
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-heading font-extrabold text-on-background group-hover:text-primary transition-colors">{survey.title}</h3>
                      <p className="text-sm font-medium text-on-surface-variant leading-relaxed opacity-70">
                        {survey.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary pt-4">
                      Mulai Sekarang
                      <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-8 bg-surface-container-lowest border border-outline-variant/10 rounded-[2rem] flex flex-col md:flex-row items-center gap-6"
        >
          <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
            <Info size={24} />
          </div> 
          <div className="text-center md:text-left space -y-1">
            <p className="text-sm font-bold text-on-background">Privasi Data Terjamin</p>
            <p className="text-xs text-on-surface-variant opacity-60 font-medium">Seluruh data yang Anda kirimkan akan dienkripsi dan hanya digunakan untuk keperluan analisis internal BPMA.</p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-outline-variant/10">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/30">
            © 2024 Institutional Compliance Engine
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
            <span className="hover:text-primary cursor-pointer transition-colors">Panduan</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Kebijakan</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Kontak</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
