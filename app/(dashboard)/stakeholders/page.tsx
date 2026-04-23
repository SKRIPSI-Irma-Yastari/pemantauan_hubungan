"use client"
import { useState, useEffect } from "react"

import { 
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  X,
  Loader2,
  AlertCircle,
  Building2,
  MapPin,
  ChevronRight,
  Mail,
  Search
} from "lucide-react"
import { useProfile } from "@/hooks/use-profile"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function StakeholdersPage() {
  const { profile, loading: profileLoading } = useProfile()
  const router = useRouter()
  const [stakeholders, setStakeholders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  
  // CRUD states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact_person: "",
    email: "",
    phone: ""
  })

  useEffect(() => {
    fetchStakeholders()
  }, [])

  const fetchStakeholders = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('stakeholders')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) throw error
      setStakeholders(data || [])
    } catch (err) {
      console.error("Error fetching stakeholders:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        name: item.name,
        address: item.address || "",
        contact_person: item.contact_person || "",
        email: item.email || "",
        phone: item.phone || ""
      })
    } else {
      setEditingItem(null)
      setFormData({
        name: "",
        address: "",
        contact_person: "",
        email: "",
        phone: ""
      })
    }
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('stakeholders')
          .update(formData)
          .eq('id', editingItem.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('stakeholders')
          .insert([formData])
        if (error) throw error
      }
      setIsModalOpen(false)
      fetchStakeholders()
    } catch (err) {
      console.error("Error saving stakeholder:", err)
      alert("Gagal menyimpan data.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus stakeholder ini?")) return
    setIsDeleting(id)
    try {
      const { error } = await supabase
        .from('stakeholders')
        .delete()
        .eq('id', id)
      if (error) throw error
      fetchStakeholders()
    } catch (err) {
      console.error("Error deleting stakeholder:", err)
      alert("Gagal menghapus data.")
    } finally {
      setIsDeleting(null)
    }
  }

  const filteredStakeholders = stakeholders.filter(sh => 
    sh.name.toLowerCase().includes(search.toLowerCase())
  )

  if (profileLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant/40">Loading Directory...</p>
        </div>
      </div>
    )
  }

  const isBPMA = profile?.role === "bpma"
  return (
    <div className="p-8 space-y-10 max-w-[1500px] mx-auto min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase mb-2">
            <span>Directory</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">Stakeholders</span>
          </nav>
          <h1 className="text-3xl font-heading font-extrabold text-on-background tracking-tight">Stakeholder Ecosystem</h1>
          <p className="text-on-surface-variant font-medium text-sm mt-1 max-w-xl">
            Directory of Kontraktor Kontrak Kerja Sama (KKKS) operating within the Aceh region.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant transition-colors group-focus-within:text-primary" />
            <input 
              type="text" 
              placeholder="Search entities..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
            />
          </div>
          {isBPMA && (
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl shadow-lg shadow-primary/20 text-sm font-bold transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              KKKS Baru
            </button>
          )}
        </div>
      </div>

      {/* Grid of Stakeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStakeholders.map((sh, idx) => (
          <motion.div
            key={sh.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group relative bg-surface-container-lowest rounded-[2rem] p-8 border border-outline-variant/5 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
            
            <div className="relative">
              <div className="flex justify-between items-start mb-6">
                <div className="h-14 w-14 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                  <Building2 size={28} />
                </div>
                {isBPMA && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenModal(sh)}
                      className="h-8 w-8 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary flex items-center justify-center transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(sh.id)}
                      disabled={isDeleting === sh.id}
                      className="h-8 w-8 rounded-lg bg-surface-container hover:bg-error hover:text-on-error flex items-center justify-center transition-colors"
                    >
                      {isDeleting === sh.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-heading font-extrabold text-on-background group-hover:text-primary transition-colors mb-2">
                {sh.name}
              </h3>
              <p className="text-xs font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] mb-6">
                {sh.contact_person || 'No Contact Person'}
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <div className="h-8 w-8 rounded-lg bg-surface-container border border-outline-variant/5 flex items-center justify-center">
                    <MapPin size={14} className="opacity-60" />
                  </div>
                  <span className="text-sm font-medium line-clamp-1">{sh.address || 'No Address'}</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <div className="h-8 w-8 rounded-lg bg-surface-container border border-outline-variant/5 flex items-center justify-center">
                    <Mail size={14} className="opacity-60" />
                  </div>
                  <span className="text-sm font-medium truncate">{sh.email || 'No Email'}</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-outline-variant/10 flex items-center justify-between">
                <Link href={`#`} className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
                  Detail KKKS <ChevronRight size={14} />
                </Link>
                <div className="h-10 w-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant/40">
                  <ShieldCheck size={18} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {isBPMA && (
          /* Add New Placeholder Card */
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => handleOpenModal()}
            className="group rounded-[2rem] border-2 border-dashed border-outline-variant/20 hover:border-primary/40 flex flex-col items-center justify-center p-8 gap-4 transition-all hover:bg-primary/5"
          >
            <div className="h-16 w-16 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant/40 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
              <Plus size={32} />
            </div>
            <div className="text-center">
              <p className="font-heading font-bold text-on-background">Onboard New Entity</p>
              <p className="text-xs font-medium text-on-surface-variant/60">Registry addition for upcoming projects</p>
            </div>
          </motion.button>
        )}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/20 shadow-2xl"
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 h-10 w-10 rounded-full flex items-center justify-center text-on-surface-variant/60 hover:bg-surface-container transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-heading font-extrabold text-on-background mb-8 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {editingItem ? <Edit2 size={20} /> : <Plus size={20} />}
              </div>
              {editingItem ? "Edit Stakeholder" : "Tambah Stakeholder"}
            </h2>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-4">Nama Perusahaan</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    type="text" 
                    className="w-full px-6 py-3.5 bg-surface-container rounded-2xl border border-outline-variant/5 focus:border-primary outline-none text-sm transition-all"
                    placeholder="Contoh: PT Medco E&P Malaka"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-4">Penanggung Jawab</label>
                  <input 
                    value={formData.contact_person}
                    onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                    type="text" 
                    className="w-full px-6 py-3.5 bg-surface-container rounded-2xl border border-outline-variant/5 focus:border-primary outline-none text-sm transition-all"
                    placeholder="Nama Kontak"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-4">Email</label>
                    <input 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      type="email" 
                      className="w-full px-6 py-3.5 bg-surface-container rounded-2xl border border-outline-variant/5 focus:border-primary outline-none text-sm transition-all"
                      placeholder="email@perusahaan.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-4">Telepon</label>
                    <input 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      type="text" 
                      className="w-full px-6 py-3.5 bg-surface-container rounded-2xl border border-outline-variant/5 focus:border-primary outline-none text-sm transition-all"
                      placeholder="+62..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-4">Alamat / Wilayah Kerja</label>
                  <textarea 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={3}
                    className="w-full px-6 py-3.5 bg-surface-container rounded-2xl border border-outline-variant/5 focus:border-primary outline-none text-sm transition-all resize-none"
                    placeholder="Wilayah Kerja Aceh Timur..."
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl bg-surface-container-high text-on-surface font-black text-sm hover:bg-surface-variant transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-4 rounded-2xl bg-primary text-on-primary font-black text-sm shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none isolate opacity-20">
        <div className="absolute top-1/4 right-0 h-[600px] w-[600px] bg-gradient-to-br from-primary-container/30 to-transparent blur-[120px]" />
        <div className="absolute bottom-1/4 left-0 h-[500px] w-[500px] bg-gradient-to-tr from-tertiary-container/30 to-transparent blur-[120px]" />
      </div>
    </div>
  )
}
