"use client"

import { useState, useEffect } from "react"
import { 
  Save, 
  Trash2, 
  Info, 
  CheckCircle2,
  Calendar,
  Building2,
  Loader2
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useProfile } from "@/hooks/use-profile"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

const INTERACTION_HIERARCHY: Record<string, Record<string, string[]>> = {
  "Komunikasi": {
    "Email Klarifikasi Teknis": [
      "Dibalas dalam 2-3 hari kerja",
      "Respon sangat cepat (< 24 jam)",
      "Tidak ada balasan setelah 3 hari kerja"
    ],
    "Surat Korespondensi Resmi": [
      "Administrasi rapi & tindak lanjut cepat",
      "Sering membutuhkan follow-up berkali-kali",
      "Tanggapan diterima sesuai durasi standar"
    ]
  },
  "Laporan": {
    "Laporan Produksi Harian (Daily)": [
      "Keterlambatan submit > 24 jam",
      "Submit tepat waktu, ada revisi minor",
      "Submit via portal tepat waktu & data sinkron"
    ],
    "FQR (Financial Quarterly Report)": [
      "Dokumen lengkap, lampiran sesuai regulasi",
      "Lampiran tidak lengkap, butuh revisi besar",
      "Laporan diterima dengan catatan kecil"
    ]
  },
  "Partisipasi": {
    "Program Pengembangan SDM": [
      "Mengadakan sertifikasi gratis untuk teknisi lokal"
    ],
    "Forum Kapasitas Nasional": [
      "Menjadi narasumber utama & membawa vendor lokal"
    ],
    "Workshop Teknis Migas": [
      "Proaktif berbagi studi kasus pengeboran"
    ],
    "Sosialisasi Lingkungan": [
      "Koordinasi program lingkungan sangat baik"
    ],
    "Program Magang Lokal": [
      "Belum membuka kuota magang lokal / tidak kooperatif",
      "Penyerapan tenaga kerja magang dari univ lokal"
    ],
    "Knowledge Sharing Session": [
      "Memberikan edukasi K3LL kepada tim teknis BPMA"
    ],
    "Kegiatan CSR Bersama": [
      "Koordinasi program pemberdayaan masyarakat sangat baik"
    ],
    "Forum Vendor Lokal": [
      "Hadir namun kontribusi data vendor masih minim"
    ]
  },
  "Rapat": {
    "MCM (Monthly Coordination Meeting)": [
      "Dihadiri GM/Manager, proaktif dalam diskusi",
      "Hadir diwakili staf teknis, cukup kooperatif",
      "Tidak hadir tanpa konfirmasi/berhalangan"
    ],
    "Technical Review Meeting": [
      "Data teknis tidak siap saat pemaparan",
      "Pemaparan cukup, ada tindak lanjut tambahan",
      "Pemaparan data teknis sangat akurat & solutif"
    ]
  }
}

export default function DataInputPage() {
  const { profile, loading: profileLoading } = useProfile()
  const router = useRouter()
  const [stakeholders, setStakeholders] = useState<any[]>([])
  const [isLoadingStakeholders, setIsLoadingStakeholders] = useState(true)

  const [formData, setFormData] = useState({
    stakeholder_id: "",
    tahun: "2026",
    bulan: "Januari",
    jenis_interaksi: "",
    detail_aktivitas: "",
    keterangan: ""
  })

  const handleJenisInteraksiChange = (val: string) => {
    setFormData({
      ...formData,
      jenis_interaksi: val,
      detail_aktivitas: "",
      keterangan: ""
    })
  }

  const handleDetailAktivitasChange = (val: string) => {
    setFormData({
      ...formData,
      detail_aktivitas: val,
      keterangan: ""
    })
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" })
  const [latestSubmission, setLatestSubmission] = useState<any | null>(null)



  useEffect(() => {
    if (!profileLoading && profile?.role === 'bpma') {
      fetchRecentSubmissions()
      fetchStakeholders()
    }
  }, [profile, profileLoading])

  const fetchStakeholders = async () => {
    try {
      setIsLoadingStakeholders(true)
      const { data, error } = await supabase
        .from('stakeholders')
        .select('id, name')
        .order('name')
      
      if (error) throw error
      setStakeholders(data || [])
    } catch (err) {
      console.error("Error fetching stakeholders:", err)
    } finally {
      setIsLoadingStakeholders(false)
    }
  }

  const fetchRecentSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('interaction_data')
        .select('*, stakeholders(name)')
        .order('created_at', { ascending: false })
        .limit(1)
      
      if (error) throw error
      if (data && data.length > 0) {
        const item = data[0]
        setLatestSubmission({
          id: item.id,
          kkks: item.stakeholders?.name || "Unknown",
          jenis_interaksi: item.jenis_interaksi || "Interaksi",
          period: `${item.bulan || ''} ${item.tahun || ''}`, 
          detail: item.detail_aktivitas || "-",
          keterangan: item.keterangan || "-",
          time: new Date(item.created_at).toLocaleDateString('id-ID'),
          status: item.status || "Harmonis"
        })
      } else {
        setLatestSubmission(null)
      }
    } catch (err) {
      console.error("Error fetching latest submission:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.stakeholder_id) {
      setStatus({ type: 'error', message: "Silakan pilih KKKS terlebih dahulu." })
      return
    }
    if (!formData.jenis_interaksi) {
      setStatus({ type: 'error', message: "Silakan pilih Jenis Interaksi terlebih dahulu." })
      return
    }
    if (!formData.detail_aktivitas) {
      setStatus({ type: 'error', message: "Silakan pilih Detail Aktivitas terlebih dahulu." })
      return
    }
    if (!formData.keterangan) {
      setStatus({ type: 'error', message: "Silakan pilih Keterangan terlebih dahulu." })
      return
    }

    setIsSubmitting(true)
    setStatus({ type: null, message: "" })

    try {
      // 1. Call ML Classification API on Flask Backend
      let statusPrediksi = "Harmonis" // Default fallback
      let showMlWarning = false

      try {
        const selectedStakeholder = stakeholders.find(s => s.id === formData.stakeholder_id)
        const kkksName = selectedStakeholder ? selectedStakeholder.name : ""

        const predictRes = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nama_kkks: kkksName,
            tahun: formData.tahun,
            bulan: formData.bulan,
            jenis_interaksi: formData.jenis_interaksi,
            detail_aktivitas: formData.detail_aktivitas,
            keterangan: formData.keterangan
          })
        })

        if (predictRes.ok) {
          const predictData = await predictRes.json()
          if (predictData.status) {
            statusPrediksi = predictData.status
          }
        } else {
          showMlWarning = true
        }
      } catch (err) {
        console.warn("Backend ML offline or connection failed. Using fallback status.", err)
        showMlWarning = true
      }

      // 2. Save to Supabase with prediction status
      const { error } = await supabase
        .from('interaction_data')
        .insert([{
          stakeholder_id: formData.stakeholder_id,
          tahun: parseInt(formData.tahun),
          bulan: formData.bulan,
          jenis_interaksi: formData.jenis_interaksi,
          detail_aktivitas: formData.detail_aktivitas,
          keterangan: formData.keterangan,
          status: statusPrediksi
        }])

      if (error) throw error

      setStatus({ type: 'success', message: "Data interaksi berhasil disimpan!" })
      setFormData({
        stakeholder_id: "",
        tahun: "2026",
        bulan: "Januari",
        jenis_interaksi: "",
        detail_aktivitas: "",
        keterangan: ""
      })
      fetchRecentSubmissions() // Refresh recent list
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || "Terjadi kesalahan saat menyimpan data." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant/40">Securing Access...</p>
        </div>
      </div>
    )
  }

  if (profile?.role !== 'bpma') {
    return (
      <div className="p-8">
        <div className="bg-error/5 border border-error/20 p-8 rounded-[2.5rem] text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-error mb-4">Akses Ditolak</h2>
          <p className="text-on-surface-variant font-medium">Halaman ini hanya dapat diakses oleh administrator BPMA untuk melakukan input data interaksi.</p>
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
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl bg-surface-container-lowest p-8 shadow-sm border border-outline-variant/10">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="font-heading text-xl font-bold text-on-surface">Formulir Parameter</h3>
              <span className="rounded-full bg-tertiary-container/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-tertiary-container">
                Live Input Mode
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Nama KKKS</label>
                  <div className="relative group">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/50 group-focus-within:text-primary transition-colors" />
                    <select 
                      className="w-full h-11 bg-surface-container-low border border-transparent rounded-xl pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container transition-all appearance-none disabled:opacity-50"
                      value={formData.stakeholder_id}
                      disabled={isLoadingStakeholders}
                      onChange={(e) => setFormData({...formData, stakeholder_id: e.target.value})}
                    >
                      {isLoadingStakeholders ? (
                        <option>Loading Stakeholders...</option>
                      ) : (
                        <>
                          <option value="">Pilih KKKS</option>
                          {stakeholders.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Tahun</label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/50 group-focus-within:text-primary transition-colors" />
                    <select 
                      className="w-full h-11 bg-surface-container-low border border-transparent rounded-xl pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container transition-all appearance-none"
                      value={formData.tahun}
                      onChange={(e) => setFormData({...formData, tahun: e.target.value})}
                    >
                      <option>2024</option>
                      <option>2025</option>
                      <option>2026</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Bulan</label>
                  <select 
                    className="w-full h-11 bg-surface-container-low border border-transparent rounded-xl px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container transition-all"
                    value={formData.bulan}
                    onChange={(e) => setFormData({...formData, bulan: e.target.value})}
                  >
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

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Jenis Interaksi</label>
                  <select 
                    className="w-full h-11 bg-surface-container-low border border-transparent rounded-xl px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container transition-all appearance-none"
                    value={formData.jenis_interaksi}
                    onChange={(e) => handleJenisInteraksiChange(e.target.value)}
                  >
                    <option value="">Pilih Jenis Interaksi</option>
                    <option value="Komunikasi">Komunikasi</option>
                    <option value="Laporan">Laporan</option>
                    <option value="Partisipasi">Partisipasi</option>
                    <option value="Rapat">Rapat</option>
                  </select>
                </div>
              </div>

              <div className="h-px bg-outline-variant/10" />

              {/* Text Area Inputs */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                    Detail Aktivitas
                  </label>
                  <select 
                    className="w-full h-11 bg-surface-container-low border border-transparent rounded-xl px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container transition-all appearance-none disabled:opacity-60 disabled:cursor-not-allowed"
                    value={formData.detail_aktivitas}
                    disabled={!formData.jenis_interaksi}
                    onChange={(e) => handleDetailAktivitasChange(e.target.value)}
                  >
                    <option value="">Pilih Detail Aktivitas</option>
                    {formData.jenis_interaksi && Object.keys(INTERACTION_HIERARCHY[formData.jenis_interaksi] || {}).map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Keterangan</label>
                  <select 
                    className="w-full h-11 bg-surface-container-low border border-transparent rounded-xl px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container transition-all appearance-none disabled:opacity-60 disabled:cursor-not-allowed"
                    value={formData.keterangan}
                    disabled={!formData.detail_aktivitas}
                    onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                  >
                    <option value="">Pilih Keterangan</option>
                    {formData.jenis_interaksi && formData.detail_aktivitas && (INTERACTION_HIERARCHY[formData.jenis_interaksi]?.[formData.detail_aktivitas] || []).map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>


              {/* Status Messages */}
              {status.type && (
                <div className={cn(
                  "p-4 rounded-xl text-sm font-bold flex items-center gap-2",
                  status.type === 'error' ? "bg-error/10 text-error border border-error/20" : "bg-tertiary/10 text-tertiary border border-tertiary/20"
                )}>
                  {status.type === 'error' ? <Info className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  {status.message}
                </div>
              )}

              {/* Form Buttons */}
              <div className="pt-6 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setFormData({
                    stakeholder_id: "",
                    tahun: "2026",
                    bulan: "Januari",
                    jenis_interaksi: "",
                    detail_aktivitas: "",
                    keterangan: ""
                  })}
                  className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-95"
                >
                  <Trash2 className="h-4 w-4" />
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-primary px-8 py-2.5 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isSubmitting ? "Menyimpan..." : "Simpan Data"}
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
              <h4 className="text-sm font-bold text-primary mb-1 uppercase tracking-tight">Standardisasi Pencatatan Interaksi BPMA</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Pastikan seluruh aktivitas interaksi KKKS dicatat secara valid, akurat, dan lengkap sesuai dengan Berita Acara (BA), korespondensi resmi, atau dokumen kedinasan terkait. Data ini akan disimpan dalam database pemantauan untuk menjaga stabilitas hubungan kelembagaan BPMA.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-5 space-y-6">
          {/* Latest Classification Result */}
          <section className="space-y-4">
            <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Hasil Klasifikasi Terbaru</h3>
            {latestSubmission ? (
              <div className={cn(
                "p-6 rounded-[2.5rem] border shadow-lg transition-all duration-300 relative overflow-hidden group",
                latestSubmission.status === "Harmonis" 
                  ? "bg-tertiary/5 border-tertiary/20 shadow-tertiary/5" 
                  : "bg-error/5 border-error/20 shadow-error/5"
              )}>
                {/* Background ambient light */}
                <div className={cn(
                  "absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 blur-3xl opacity-20",
                  latestSubmission.status === "Harmonis" ? "bg-tertiary" : "bg-error"
                )} />

                {/* Date stamp */}
                <div className="absolute top-6 right-6">
                  <span className="text-[9px] font-black uppercase text-on-surface-variant/40 tracking-wider">
                    {latestSubmission.time}
                  </span>
                </div>

                {/* Status Indicator Centered */}
                <div className="flex flex-col items-center justify-center text-center py-6 border-b border-outline-variant/10">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50 mb-3">
                    STATUS KESTABILAN HUBUNGAN
                  </span>
                  <div className={cn(
                    "px-8 py-3 rounded-full text-base font-black uppercase tracking-widest border shadow-lg transition-all transform hover:scale-105 duration-300",
                    latestSubmission.status === "Harmonis"
                      ? "bg-tertiary text-on-tertiary border-tertiary-container/30 shadow-tertiary/20"
                      : "bg-error text-on-error border-error-container/30 shadow-error/20"
                  )}>
                    {latestSubmission.status}
                  </div>
                </div>

                {/* KKKS Centered */}
                <div className="text-center py-6">
                  <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/50">KONTRAKTOR (KKKS)</span>
                  <h4 className="font-heading text-lg font-black text-on-surface mt-1 leading-snug">
                    {latestSubmission.kkks}
                  </h4>
                </div>

                <div className="space-y-4">
                  {/* Period & Type Grid */}
                  <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-outline-variant/10">
                    <div className="bg-surface-container-low/60 p-3 rounded-2xl border border-outline-variant/5">
                      <span className="text-[9px] font-black uppercase tracking-wider text-on-surface-variant/65 block mb-1">Periode</span>
                      <span className="font-bold text-on-surface">{latestSubmission.period}</span>
                    </div>
                    <div className="bg-surface-container-low/60 p-3 rounded-2xl border border-outline-variant/5">
                      <span className="text-[9px] font-black uppercase tracking-wider text-on-surface-variant/65 block mb-1">Jenis Interaksi</span>
                      <span className="font-bold text-primary">{latestSubmission.jenis_interaksi}</span>
                    </div>
                  </div>

                  {/* Detail Aktivitas */}
                  <div className="pt-1">
                    <div className="bg-surface-container-low/60 p-4 rounded-2xl border border-outline-variant/5">
                      <span className="text-[9px] font-black uppercase tracking-wider text-on-surface-variant/65 block mb-1">Detail Aktivitas</span>
                      <p className="text-xs font-bold text-on-surface leading-relaxed">
                        {latestSubmission.detail}
                      </p>
                    </div>
                  </div>

                  {/* Keterangan */}
                  {latestSubmission.keterangan && latestSubmission.keterangan !== "-" && (
                    <div className="pt-1">
                      <div className="bg-surface-container-low/60 p-4 rounded-2xl border border-outline-variant/5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-on-surface-variant/65 block mb-1">Keterangan / Catatan</span>
                        <p className="text-xs text-on-surface-variant/85 font-medium leading-relaxed">
                          {latestSubmission.keterangan}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-on-surface-variant/40 font-bold uppercase tracking-widest text-[10px] bg-surface-container-low rounded-[2rem]">
                Belum ada data interaksi yang disimpan.
              </div>
            )}
          </section>


        </div>
      </div>
    </div>
  )
}
