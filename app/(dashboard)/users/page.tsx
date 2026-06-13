"use client"

import { useState, useEffect } from "react"
import { 
  ShieldCheck,
  Users,
  Search,
  ChevronRight,
  Building2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
  UserCog
} from "lucide-react"
import { useProfile } from "@/hooks/use-profile"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function UsersManagementPage() {
  const { profile: currentProfile, loading: profileLoading } = useProfile()
  const router = useRouter()

  const [profiles, setProfiles] = useState<any[]>([])
  const [stakeholders, setStakeholders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  
  // Status feedback per user row
  const [savingRowId, setSavingRowId] = useState<string | null>(null)
  const [successRowId, setSuccessRowId] = useState<string | null>(null)
  const [errorRowId, setErrorRowId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (!profileLoading) {
      if (currentProfile?.role === "bpma") {
        fetchData()
      } else {
        setIsLoading(false)
      }
    }
  }, [currentProfile, profileLoading])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [profilesRes, stakeholdersRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('stakeholders').select('*').order('name', { ascending: true })
      ])

      if (profilesRes.error) throw profilesRes.error
      if (stakeholdersRes.error) throw stakeholdersRes.error

      setProfiles(profilesRes.data || [])
      setStakeholders(stakeholdersRes.data || [])
    } catch (err) {
      console.error("Error fetching data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle local state changes before saving
  const handleRoleChange = (userId: string, newRole: "bpma" | "stakeholder") => {
    setProfiles(prev => prev.map(p => {
      if (p.id === userId) {
        return {
          ...p,
          role: newRole,
          // Clear stakeholder_id if changing to bpma
          stakeholder_id: newRole === "bpma" ? null : p.stakeholder_id
        }
      }
      return p
    }))
  }

  const handleStakeholderChange = (userId: string, stakeholderId: string | null) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === userId) {
        return {
          ...p,
          stakeholder_id: stakeholderId === "" ? null : stakeholderId
        }
      }
      return p
    }))
  }

  // Save changes to database
  const handleSaveUser = async (user: any) => {
    setSavingRowId(user.id)
    setSuccessRowId(null)
    setErrorRowId(null)
    setErrorMsg("")

    try {
      // If role is bpma, stakeholder_id must be null
      const updatedStakeholderId = user.role === "bpma" ? null : user.stakeholder_id

      const { error } = await supabase
        .from('profiles')
        .update({
          role: user.role,
          stakeholder_id: updatedStakeholderId
        })
        .eq('id', user.id)

      if (error) throw error

      setSuccessRowId(user.id)
      setTimeout(() => setSuccessRowId(null), 3000)
    } catch (err: any) {
      console.error("Error updating user profile:", err)
      setErrorRowId(user.id)
      setErrorMsg(err.message || "Gagal memperbarui profil.")
    } finally {
      setSavingRowId(null)
    }
  }

  const filteredProfiles = profiles.filter(p => 
    (p.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(search.toLowerCase())
  )

  if (profileLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant/40">Memuat Data Pengguna...</p>
        </div>
      </div>
    )
  }

  // Authorization check
  if (currentProfile?.role !== "bpma") {
    return (
      <div className="p-8">
        <div className="bg-error/5 border border-error/20 p-8 rounded-[2.5rem] text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-error mb-4">Akses Ditolak</h2>
          <p className="text-on-surface-variant font-medium">Halaman ini hanya dapat diakses oleh administrator BPMA.</p>
          <button 
            onClick={() => router.push('/stakeholder/dashboard')}
            className="mt-8 px-8 py-3 bg-error text-on-error rounded-xl font-black text-sm hover:scale-105 transition-transform"
          >
            Buka Dashboard Stakeholder
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-10 max-w-[1500px] mx-auto min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-on-surface-variant/60 uppercase mb-2">
            <span>Management</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">Kelola Pengguna</span>
          </nav>
          <h1 className="text-3xl font-heading font-extrabold text-on-background tracking-tight">Kelola Akses Pengguna</h1>
          <p className="text-on-surface-variant font-medium text-sm mt-1 max-w-2xl">
            Lakukan pemetaan akun stakeholder (KKKS) ke entitas perusahaan masing-masing serta manajemen peran pengguna di dalam sistem.
          </p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-container-lowest p-4 rounded-3xl border border-outline-variant/10 shadow-sm">
        <div className="relative w-full sm:max-w-md group">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan nama atau email..."
            className="w-full pl-12 pr-6 py-3.5 bg-surface-container rounded-2xl border border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none text-sm font-medium transition-all"
          />
        </div>
        <div className="text-xs font-bold text-on-surface-variant/60 px-4">
          Menampilkan {filteredProfiles.length} dari {profiles.length} Pengguna
        </div>
      </div>

      {/* Profiles Table */}
      <div className="bg-surface-container-lowest rounded-[2.5rem] border border-outline-variant/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/10 bg-surface-container-low/50">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Nama Lengkap</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Email</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Peran (Role)</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Entitas KKKS (Stakeholder)</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-on-surface-variant/40 italic text-sm">
                    Tidak ada data pengguna yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((user) => {
                  const isSaving = savingRowId === user.id
                  const isSuccess = successRowId === user.id
                  const isError = errorRowId === user.id

                  return (
                    <tr 
                      key={user.id} 
                      className="border-b border-outline-variant/5 hover:bg-surface-container-low/20 transition-colors align-middle"
                    >
                      {/* Name */}
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {(user.full_name || user.email || "?")[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-on-background">{user.full_name || "-"}</p>
                            <p className="text-[10px] font-medium text-on-surface-variant/40">Terdaftar: {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-6 text-sm font-medium text-on-surface-variant">
                        {user.email}
                      </td>

                      {/* Role Dropdown / Badge */}
                      <td className="p-6">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as "bpma" | "stakeholder")}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 outline-none transition-all cursor-pointer",
                            user.role === "bpma" 
                              ? "bg-primary/5 border-primary/20 text-primary focus:border-primary" 
                              : "bg-secondary/5 border-secondary/20 text-secondary focus:border-secondary"
                          )}
                        >
                          <option value="bpma">BPMA Admin</option>
                          <option value="stakeholder">Stakeholder</option>
                        </select>
                      </td>

                      {/* Stakeholder KKKS Assignment */}
                      <td className="p-6">
                        {user.role === "bpma" ? (
                          <span className="text-xs font-semibold text-on-surface-variant/40 italic">
                            Akses Penuh Administrator
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Building2 size={16} className={cn(
                              "shrink-0",
                              user.stakeholder_id ? "text-secondary" : "text-on-surface-variant/30"
                            )} />
                            <select
                              value={user.stakeholder_id || ""}
                              onChange={(e) => handleStakeholderChange(user.id, e.target.value || null)}
                              className={cn(
                                "w-full max-w-[280px] px-4 py-2 bg-surface-container rounded-xl border border-transparent focus:border-secondary outline-none text-xs font-bold transition-all cursor-pointer",
                                !user.stakeholder_id && "text-on-surface-variant/50 font-medium italic bg-surface-container-high/40"
                              )}
                            >
                              <option value="">-- Hubungkan dengan KKKS --</option>
                              {stakeholders.map(sh => (
                                <option key={sh.id} value={sh.id}>{sh.name}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-6">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <button
                            onClick={() => handleSaveUser(user)}
                            disabled={isSaving}
                            className={cn(
                              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 disabled:opacity-50",
                              isSuccess 
                                ? "bg-tertiary text-on-tertiary" 
                                : isError 
                                ? "bg-error text-on-error" 
                                : "bg-primary text-on-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5"
                            )}
                          >
                            {isSaving ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : isSuccess ? (
                              <CheckCircle2 size={14} />
                            ) : isError ? (
                              <AlertCircle size={14} />
                            ) : (
                              <Save size={14} />
                            )}
                            {isSuccess ? "Tersimpan" : isError ? "Gagal" : "Simpan"}
                          </button>
                          
                          <AnimatePresence>
                            {isError && (
                              <motion.p 
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-[9px] font-bold text-error max-w-[120px] text-center"
                              >
                                {errorMsg}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
