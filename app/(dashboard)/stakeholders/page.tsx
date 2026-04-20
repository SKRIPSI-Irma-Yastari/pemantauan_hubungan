"use client"

import { 
  Users, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowUpRight,
  Filter,
  MoreVertical,
  Building2,
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"

const stakeholders = [
  {
    id: "medco",
    name: "PT Medco E&P Malaka",
    region: "Aceh Timur",
    type: "KKKS - Natural Gas",
    status: "Active",
    performance: 92,
    contact: "contact@medcoenergi.com",
    address: "Blok A, Aceh Timur",
  },
  {
    id: "pge",
    name: "PT Pema Global Energi (PGE)",
    region: "Aceh Utara",
    type: "KKKS - Oil & Gas",
    status: "Active",
    performance: 88,
    contact: "info@pemaglobal.com",
    address: "Blok B, Aceh Utara",
  },
  {
    id: "triangle",
    name: "Triangle Pase",
    region: "Aceh Utara",
    type: "KKKS - Exploration",
    status: "Active",
    performance: 75,
    contact: "ops@trianglepase.co.id",
    address: "Pase Block, Aceh Utara",
  },
  {
    id: "conrad",
    name: "Conrad Asia Energy",
    region: "Aceh Barat",
    type: "KKKS - Deep Water",
    status: "Planning",
    performance: 0,
    contact: "admin@conradasia.com",
    address: "Offshore Aceh Barat",
  },
  {
    id: "zaratex",
    name: "Zaratex N.V",
    region: "Lhokseumawe",
    type: "KKKS - Technical Services",
    status: "Active",
    performance: 82,
    contact: "support@zaratex.com",
    address: "Lhokseumawe Support Base",
  }
]

export default function StakeholdersPage() {
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
              className="bg-surface-container-low border border-outline-variant/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-surface-container-high px-4 py-2.5 rounded-xl border border-outline-variant/10 text-sm font-bold transition-all hover:bg-surface-variant">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Grid of Stakeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stakeholders.map((sh, idx) => (
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
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                  sh.status === "Active" 
                    ? "bg-tertiary-container/20 text-tertiary border-tertiary/10" 
                    : "bg-surface-container text-on-surface-variant/60 border-outline-variant/10"
                )}>
                  {sh.status}
                </div>
              </div>

              <h3 className="text-xl font-heading font-extrabold text-on-background group-hover:text-primary transition-colors mb-2">
                {sh.name}
              </h3>
              <p className="text-xs font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] mb-6">
                {sh.type}
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <div className="h-8 w-8 rounded-lg bg-surface-container border border-outline-variant/5 flex items-center justify-center">
                    <MapPin size={14} className="opacity-60" />
                  </div>
                  <span className="text-sm font-medium">{sh.region}</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <div className="h-8 w-8 rounded-lg bg-surface-container border border-outline-variant/5 flex items-center justify-center">
                    <Mail size={14} className="opacity-60" />
                  </div>
                  <span className="text-sm font-medium">{sh.contact}</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-outline-variant/10 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest mb-1">Compliance Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-heading font-extrabold text-on-background">
                      {sh.performance > 0 ? sh.performance : "--"}
                    </span>
                    {sh.performance > 0 && <span className="text-xs font-bold text-on-surface-variant opacity-40">%</span>}
                  </div>
                </div>
                <Link href={`/stakeholders/${sh.id}`}>
                  <button className="h-12 w-12 rounded-xl bg-surface-container-high border border-outline-variant/10 flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-300">
                    <ArrowUpRight size={20} />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add New Placeholder Card */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="group rounded-[2rem] border-2 border-dashed border-outline-variant/20 hover:border-primary/40 flex flex-col items-center justify-center p-8 gap-4 transition-all hover:bg-primary/5"
        >
          <div className="h-16 w-16 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant/40 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
            <Users size={32} />
          </div>
          <div className="text-center">
            <p className="font-heading font-bold text-on-background">Onboard New Entity</p>
            <p className="text-xs font-medium text-on-surface-variant/60">Registry addition for upcoming projects</p>
          </div>
        </motion.button>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none isolate opacity-20">
        <div className="absolute top-1/4 right-0 h-[600px] w-[600px] bg-gradient-to-br from-primary-container/30 to-transparent blur-[120px]" />
        <div className="absolute bottom-1/4 left-0 h-[500px] w-[500px] bg-gradient-to-tr from-tertiary-container/30 to-transparent blur-[120px]" />
      </div>
    </div>
  )
}
