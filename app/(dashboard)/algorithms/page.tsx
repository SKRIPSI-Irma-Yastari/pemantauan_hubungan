"use client"

import { useState, useEffect } from "react"
import { 
  Terminal, 
  Play, 
  Download, 
  Settings2, 
  CheckCircle2, 
  BrainCircuit,
  Binary,
  GitBranch
} from "lucide-react"
import { useProfile } from "@/hooks/use-profile"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const initialLogs = [
  { id: 1, type: "init", time: "10:12:01", message: "Inisialisasi Algoritma CART (Classification and Regression Trees)..." },
  { id: 2, type: "validate", time: "10:12:03", message: "Dataset Stakeholder dimuat. N=48 Entitas (KKKS)" },
  { id: 3, type: "clean", time: "10:12:04", message: "Menghilangkan nilai null pada atribut 'Respons Komunikasi'..." },
  { id: 4, type: "clean", time: "10:12:05", message: "Normalisasi data (Rentang 0-1) menggunakan Min-Max Scaler." },
  { id: 5, type: "ready", time: "10:12:07", message: "Preprocessing Selesai. Data siap untuk kalkulasi Gini Index." },
]

const giniData = [
  { attribute: "Kepatuhan Laporan", samples: 48, gini: 0.485, gain: 0.210, status: "Root Node" },
  { attribute: "Kehadiran Rapat", samples: 32, gini: 0.320, gain: 0.125, status: "Split Node" },
  { attribute: "Respons Komunikasi", samples: 16, gini: 0.110, gain: 0.045, status: "Leaf Node" },
  { attribute: "Partisipasi", samples: 48, gini: 0.450, gain: 0.080, status: "Lower Gain" },
]

export default function AlgorithmsPage() {
  const { profile, loading: profileLoading } = useProfile()
  const router = useRouter()
  const [logs, setLogs] = useState(initialLogs)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setLogs(prev => [
          ...prev.slice(-9),
          { 
            id: Date.now(), 
            type: "proc", 
            time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
            message: "Mengkalkulasi Gini Impurity untuk atribut 'Partisipasi'..." 
          }
        ])
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isRunning])

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant/40">Analyzing Logic...</p>
        </div>
      </div>
    )
  }

  if (profile?.role !== 'bpma') {
    return (
      <div className="p-8">
        <div className="bg-error/5 border border-error/20 p-8 rounded-[2.5rem] text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-error mb-4">Akses Ditolak</h2>
          <p className="text-on-surface-variant font-medium">Halaman ini hanya dapat diakses oleh administrator BPMA untuk melihat transparansi proses algoritma CART.</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="mt-8 px-8 py-3 bg-error text-on-error rounded-xl font-black text-sm hover:scale-105 transition-transform"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-on-background">
            Transparansi Proses CART
          </h2>
          <p className="mt-1 text-on-surface-variant font-medium">
            Analisis real-time induksi Pohon Keputusan menggunakan Algoritma CART (Classification and Regression Trees).
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-xl bg-surface-container-high px-4 py-2.5 text-sm font-bold text-on-surface transition-all hover:bg-surface-variant active:scale-95">
            <Download className="h-4 w-4" />
            Export Logic
          </button>
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold shadow-lg transition-all active:scale-95",
              isRunning 
                ? "bg-secondary text-on-secondary shadow-secondary/20" 
                : "bg-primary text-on-primary shadow-primary/20"
            )}
          >
            {isRunning ? <Settings2 className="h-4 w-4 animate-spin-slow" /> : <Play className="h-4 w-4 fill-current" />}
            {isRunning ? "Running Pipeline" : "Re-run Pipeline"}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Technical Logs & Stats */}
        <div className="lg:col-span-4 space-y-8">
          {/* Terminal Log */}
          <section className="flex flex-col h-[400px] rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/10 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-heading font-bold text-on-surface flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                Log Validasi & Cleaning
              </h4>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-tertiary-container/30 text-[10px] font-bold text-on-tertiary-container">
                <span className="h-1.5 w-1.5 rounded-full bg-tertiary animate-pulse" />
                ACTIVE
              </span>
            </div>
            
            <div className="flex-1 bg-[#12181b] rounded-xl p-5 font-mono text-[11px] leading-relaxed overflow-y-auto scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {logs.map((log) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3 mb-2"
                  >
                    <span className="text-primary-dim opacity-70">[{log.time}]</span>
                    <span className={cn(
                      "font-bold uppercase",
                      log.type === "validate" && "text-tertiary",
                      log.type === "clean" && "text-secondary",
                      log.type === "proc" && "text-primary",
                      log.type === "ready" && "text-tertiary",
                      log.type === "init" && "text-on-surface-variant/40"
                    )}>
                      {log.type}:
                    </span>
                    <span className="text-on-surface-variant/90">{log.message}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Model Confidence Metric */}
          <section className="rounded-2xl bg-white/40 backdrop-blur-xl p-8 border border-outline-variant/5 shadow-xl shadow-surface-dim/20 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 h-32 w-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
            
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-6 text-center">
              Model Confidence Score
            </p>
            
            <div className="relative h-40 w-40 mx-auto">
              <svg className="h-full w-full -rotate-90">
                <circle cx="80" cy="80" r="70" fill="transparent" stroke="var(--surface-container)" strokeWidth="12" />
                <motion.circle 
                  cx="80" cy="80" r="70" 
                  fill="transparent" 
                  stroke="var(--color-tertiary)" 
                  strokeWidth="12" 
                  strokeDasharray="440"
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset: 440 - (440 * 0.88) }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-3xl font-extrabold text-on-surface">88%</span>
                <span className="text-[9px] font-bold text-tertiary uppercase tracking-tighter">Optimal Stability</span>
              </div>
            </div>
          </section>
        </div>

        {/* Gini Calculations Table */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <section className="rounded-2xl bg-surface-container-lowest p-8 shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="font-heading text-xl font-bold text-on-surface">Tabel Perhitungan Gini Index</h4>
                <p className="text-xs font-medium text-on-surface-variant opacity-60 mt-1">
                  Seleksi atribut berdasarkan minimalisasi Gini Impurity.
                </p>
              </div>
              <div className="flex bg-surface-container rounded-lg p-1">
                <button className="rounded px-4 py-1.5 text-xs font-bold bg-white shadow-sm text-primary transition-all">Standard</button>
                <button className="rounded px-4 py-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-all">Advanced</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/10 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-left">
                    <th className="pb-4 px-2">Attribute</th>
                    <th className="pb-4 px-2 text-center">Samples</th>
                    <th className="pb-4 px-2 text-center">Avg Gini</th>
                    <th className="pb-4 px-2 text-center">Gini Gain</th>
                    <th className="pb-4 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {giniData.map((row) => (
                    <tr key={row.attribute} className="group hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-5 px-2">
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface">{row.attribute}</span>
                          <span className="text-[10px] text-on-surface-variant font-medium opacity-60">Mandatory reporting frequency</span>
                        </div>
                      </td>
                      <td className="py-5 px-2 text-center font-mono font-medium text-on-surface-variant">{row.samples.toLocaleString()}</td>
                      <td className="py-5 px-2 text-center font-mono font-medium text-on-surface-variant">{row.gini}</td>
                      <td className="py-5 px-2 text-center font-mono font-bold text-primary">{row.gain}</td>
                      <td className="py-5 px-2 text-right">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter",
                          row.status === "Root Node" ? "bg-tertiary-container/30 text-tertiary" : "bg-surface-container-high text-on-surface-variant"
                        )}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Decision Tree Visualization */}
          <section className="rounded-3xl bg-surface-container-low/40 p-10 border border-outline-variant/5 relative overflow-hidden isolate">
            <div className="absolute inset-0 -z-10 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(var(--color-primary) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            
            <div className="flex flex-col items-center">
              <div className="mb-14 text-center">
                <h4 className="font-heading text-2xl font-extrabold text-on-surface">Visualisasi Pohon Keputusan</h4>
                <p className="text-on-surface-variant/70 font-medium italic text-sm mt-1">Current Model State: Induction Complete</p>
              </div>

              {/* Tree Diagram */}
              <div className="flex flex-col items-center w-full max-w-2xl">
                {/* Root */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="relative z-10 flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl border-t-4 border-primary w-64 text-center cursor-pointer mb-12"
                >
                  <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Root Attribute</p>
                  <p className="font-heading text-xl font-extrabold text-on-surface">Kepatuhan</p>
                  <div className="mt-2 bg-primary/5 py-1 px-3 rounded flex items-center justify-center gap-2">
                    <Binary className="h-3 w-3 text-primary" />
                    <span className="font-mono text-[10px] font-bold text-primary">Gini Gain: 0.148</span>
                  </div>
                </motion.div>

                {/* Level 1 Connections */}
                <div className="relative flex justify-between w-full px-12 group">
                  <div className="absolute inset-x-0 top-0 h-px bg-outline-variant/30 w-[80%] mx-auto" />
                  
                  {/* Left Column */}
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-px bg-outline-variant/30" />
                    <div className="mb-4 bg-surface-container-lowest px-3 py-1 rounded-full text-[10px] font-bold text-on-surface-variant border border-outline-variant/10">
                      &lt; 0.75 (Low)
                    </div>
                    
                    <motion.div className="bg-white p-5 rounded-2xl shadow-md border border-outline-variant/10 w-52 text-center">
                      <p className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Split Node</p>
                      <p className="font-bold text-on-surface">Kehadiran</p>
                    </motion.div>

                    <div className="h-8 w-px bg-outline-variant/30 mt-4" />
                    {/* Final Leaves */}
                    <div className="flex gap-4">
                      <div className="bg-error-container/10 border border-error/20 px-4 py-2 rounded-xl text-[10px] font-bold text-error uppercase">Kurang Harmonis</div>
                      <div className="bg-surface-container-high border border-outline-variant/10 px-4 py-2 rounded-xl text-[10px] font-bold text-on-surface-variant opacity-60 uppercase">Moderate</div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-px bg-outline-variant/30" />
                    <div className="mb-4 bg-surface-container-lowest px-3 py-1 rounded-full text-[10px] font-bold text-on-surface-variant border border-outline-variant/10">
                      &ge; 0.75 (High)
                    </div>
                    
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="bg-tertiary-container/30 p-6 rounded-2xl shadow-lg border-2 border-tertiary/20 w-56 text-center shadow-tertiary/5"
                    >
                      <CheckCircle2 className="h-6 w-6 text-tertiary mx-auto mb-2" />
                      <p className="font-heading font-extrabold text-tertiary tracking-tight">HARMONIS</p>
                      <p className="text-[9px] font-bold text-on-tertiary-container/60 mt-1">Confidence Score Tinggi</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
