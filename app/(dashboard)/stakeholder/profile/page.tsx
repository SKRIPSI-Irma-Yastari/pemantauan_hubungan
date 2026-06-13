"use client"

import { useEffect, useState } from "react"
import { 
  User, 
  Building2, 
  Mail, 
  ShieldCheck, 
  MapPin, 
  Phone,
  Calendar
} from "lucide-react"
import { useProfile } from "@/hooks/use-profile"
import { supabase } from "@/lib/supabase"

export default function StakeholderProfile() {
  const { profile, loading: profileLoading } = useProfile()
  const [stakeholder, setStakeholder] = useState<any>(null)
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
      } catch (err) {
        console.error("Error fetching stakeholder profile data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [profile, profileLoading])

  if (profileLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant/40">Memuat Profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-10 max-w-[1000px] mx-auto min-h-screen">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
            Pengaturan Akun & Profil
          </span>
        </div>
        <h1 className="text-4xl font-heading font-extrabold text-on-background tracking-tight">
          Profil Akun
        </h1>
        <p className="text-on-surface-variant font-medium mt-2">
          Detail informasi akun login dan profil perusahaan KKKS Anda yang terdaftar di sistem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Card: Account details */}
        <section className="bg-surface-container-lowest rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-outline-variant/5 pb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <User size={20} />
            </div>
            <h3 className="text-lg font-heading font-extrabold text-on-background">Informasi Pengguna</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Nama Lengkap</label>
              <p className="text-sm font-bold text-on-surface mt-1">{profile?.full_name || "-"}</p>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Alamat Email</label>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4 text-on-surface-variant/50" />
                <p className="text-sm font-bold text-on-surface">{profile?.email || "-"}</p>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Hak Akses</label>
              <div className="flex items-center gap-2 mt-1 text-tertiary">
                <ShieldCheck className="h-4 w-4" />
                <p className="text-sm font-bold uppercase tracking-wider">Stakeholder (KKKS)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Card: Company details */}
        <section className="bg-surface-container-lowest rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-outline-variant/5 pb-4">
            <div className="h-10 w-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
              <Building2 size={20} />
            </div>
            <h3 className="text-lg font-heading font-extrabold text-on-background">Profil Perusahaan</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Nama KKKS</label>
              <p className="text-sm font-bold text-on-surface mt-1">{stakeholder?.name || "-"}</p>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Alamat Kantor</label>
              <div className="flex items-start gap-2 mt-1">
                <MapPin className="h-4 w-4 text-on-surface-variant/50 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-on-surface leading-relaxed">{stakeholder?.address || "Aceh, Indonesia"}</p>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Kontak Telepon</label>
              <div className="flex items-center gap-2 mt-1">
                <Phone className="h-4 w-4 text-on-surface-variant/50" />
                <p className="text-xs font-bold text-on-surface">{stakeholder?.phone || "-"}</p>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Terdaftar Pada</label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-on-surface-variant/50" />
                <p className="text-xs font-bold text-on-surface">
                  {stakeholder?.created_at ? new Date(stakeholder.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
