"use client"

import { useState } from "react"
import { 
  Save, 
  Trash2, 
  Info, 
  ChevronRight, 
  Clock, 
  CheckCircle2,
  Calendar,
  Building2,
  Percent,
  Timer
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const recentSubmissions = [
  { id: 1, kkks: "PetroChina Ltd.", period: "Sem I 2024", compliance: "92%", time: "2h ago" },
  { id: 2, kkks: "Medco E&P", period: "Sem I 2024", compliance: "78%", time: "5h ago" },
  { id: 3, kkks: "ENI Indonesia", period: "Sem II 2023", compliance: "85%", time: "Yesterday" },
]

export default function DataInputPage() {
  const [formData, setFormData] = useState({
    period: "Semester I (Januari - Juni 2024)",
    stakeholder: "Pertamina Hulu Rokan",
    compliance: "",
    attendance: "",
    response: "",
    participation: "Aktif (Diatas 80%)",
  })

  return (
    <div className="p-8 space-y-8 max-w-[1200px] mx-auto">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-on-surface">
          Input Data Interaksi
        </h2>
        <p className="mt-1 font-medium text-on-surface-variant/70">
          Masukan parameter interaksi untuk memicu algoritma klasifikasi.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl bg-surface-container-lowest p-8 shadow-sm border border-outline-variant/10">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="font-heading text-xl font-bold text-on-surface">Formulir Parameter</h3>
              <span className="rounded-full bg-tertiary-container/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-tertiary-container">
                Live Input Mode
              </span>
            </div>

            <form className="space-y-8">
              {/* Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Pilihan Periode</label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/50 group-focus-within:text-primary transition-colors" />
                    <select 
                      className="w-full h-11 bg-surface-container-low border border-transparent rounded-xl pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container transition-all appearance-none"
                      value={formData.period}
                      onChange={(e) => setFormData({...formData, period: e.target.value})}
                    >
                      <option>Semester I (Januari - Juni 2024)</option>
                      <option>Semester II (Juli - Desember 2024)</option>
                      <option>Semester I (Januari - Juni 2023)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Stakeholder Target</label>
                  <div className="relative group">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/50 group-focus-within:text-primary transition-colors" />
                    <select 
                      className="w-full h-11 bg-surface-container-low border border-transparent rounded-xl pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container transition-all appearance-none"
                      value={formData.stakeholder}
                      onChange={(e) => setFormData({...formData, stakeholder: e.target.value})}
                    >
                      <option>Pertamina Hulu Rokan</option>
                      <option>Chevron Pacific Indonesia</option>
                      <option>ExxonMobil Cepu</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="h-px bg-outline-variant/10" />

              {/* Numerical Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                    Kepatuhan Laporan
                    <Info className="h-3 w-3 opacity-40" />
                  </label>
                  <div className="relative group">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-on-surface-variant opacity-40">%</div>
                    <input 
                      type="number"
                      placeholder="0 - 100"
                      className="w-full h-11 bg-surface-container-low border border-transparent rounded-xl px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container transition-all"
                    />
                  </div>
                  <p className="text-[10px] italic text-on-surface-variant/60">Persentase laporan teknis tepat waktu.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Kehadiran Rapat</label>
                  <div className="relative group">
                    <input 
                      type="number"
                      placeholder="Jumlah sesi"
                      className="w-full h-11 bg-surface-container-low border border-transparent rounded-xl px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container transition-all"
                    />
                  </div>
                  <p className="text-[10px] italic text-on-surface-variant/60">Total kehadiran dalam rapat resmi.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Respon Komunikasi</label>
                  <div className="relative group">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-tighter">Hari</div>
                    <input 
                      type="number"
                      placeholder="Rata-rata hari"
                      className="w-full h-11 bg-surface-container-low border border-transparent rounded-xl px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container transition-all"
                    />
                  </div>
                  <p className="text-[10px] italic text-on-surface-variant/60">Kecepatan membalas korespendensi.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Partisipasi Kegiatan</label>
                  <select 
                    className="w-full h-11 bg-surface-container-low border border-transparent rounded-xl px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container transition-all"
                  >
                    <option>Aktif (Diatas 80%)</option>
                    <option>Moderat (50% - 80%)</option>
                    <option>Pasif (Dibawah 50%)</option>
                  </select>
                  <p className="text-[10px] italic text-on-surface-variant/60">Keterlibatan dalam workshop non-rutin.</p>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-6 flex items-center justify-end gap-3">
                <button className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-95">
                  <Trash2 className="h-4 w-4" />
                  Discard
                </button>
                <button className="flex items-center gap-2 rounded-xl bg-primary px-8 py-2.5 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95">
                  <Save className="h-4 w-4" />
                  Submit Data
                </button>
              </div>
            </form>
          </div>

          {/* Guide Card */}
          <div className="rounded-2xl bg-primary/5 p-6 border-l-4 border-primary/40 flex gap-4">
            <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary mb-1 uppercase tracking-tight">Standardisasi Input</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Pastikan semua data numerik telah divalidasi sesuai dengan Berita Acara Rapat Bulanan. 
                Kesalahan input data akan mempengaruhi skor algoritma klasifikasi secara otomatis.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Submissions */}
          <section className="space-y-4">
            <h3 className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Recent Submissions</h3>
            <div className="space-y-3">
              {recentSubmissions.map((sub) => (
                <div key={sub.id} className="group bg-surface-container-low p-4 rounded-xl border border-transparent hover:border-outline-variant/10 hover:bg-surface-container-lowest hover:shadow-sm cursor-pointer transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-sm text-on-surface">{sub.kkks}</p>
                    <span className="text-[10px] font-bold text-on-surface-variant opacity-40">{sub.time}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="rounded bg-white px-2 py-0.5 text-[9px] font-bold text-on-surface-variant/70 border border-outline-variant/10">
                      {sub.period}
                    </span>
                    <span className="rounded bg-white px-2 py-0.5 text-[9px] font-bold text-primary border border-primary/10">
                      {sub.compliance} Compliance
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Help Action */}
          <button className="w-full flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl group hover:bg-primary/5 transition-all">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <Clock className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-on-surface">View Full History</p>
                <p className="text-[10px] text-on-surface-variant font-medium">Archive of all past inputs</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}
