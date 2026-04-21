"use client"

import { 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Globe, 
  Building2, 
  Activity,
  ClipboardCheck,
  LayoutDashboard,
  ArrowUpRight
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none isolate">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-[0.03]" />
        <div className="absolute top-[20%] -left-24 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-[60%] -right-24 w-[600px] h-[600px] bg-tertiary/5 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-outline-variant/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
              <Globe size={22} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-on-background leading-tight">Siperta</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary leading-tight">Institutional Engine</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Ecosystem", "Features", "Public Survey"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <Link href="/dashboard">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-surface-container-high border border-outline-variant/10 text-[10px] font-black uppercase tracking-[0.15em] text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary transition-all active:scale-95">
              Portal Internal
              <LayoutDashboard size={14} />
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-20 md:pt-56 md:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-[10px] font-black tracking-[0.2em] text-primary uppercase">
              <Activity size={14} className="animate-pulse" />
              Monitoring Hubungan Kerja Sama
            </div>
            <h1 className="text-6xl md:text-8xl font-heading font-extrabold text-on-background tracking-tighter leading-[0.9] text-balance">
              Transparansi <br />
              <span className="text-primary italic">Energi</span> Masa Depan.
            </h1>
            <p className="text-on-surface-variant font-medium text-lg md:text-xl leading-relaxed max-w-xl opacity-80">
              Sistem Pemantauan Hubungan Kerja Sama (Siperta) untuk optimalisasi tata kelola industri hulu migas di wilayah kedaulatan Aceh.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link href="/public/surveys/new">
                <button className="group w-full sm:w-auto relative flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-primary text-on-primary font-heading font-black text-sm shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] hover:-translate-y-1 active:scale-95 transition-all overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  Isi Survey Publik
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
              <Link href="/stakeholders">
                <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-surface-container border border-outline-variant/10 text-on-surface font-heading font-black text-sm hover:bg-surface-container-high transition-all">
                  Eksplorasi Stakeholder
                </button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-8">
              <div className="space-y-1">
                <p className="text-3xl font-heading font-black text-on-background tracking-tighter">95%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 leading-none">Compliance Rate</p>
              </div>
              <div className="h-8 w-px bg-outline-variant/20" />
              <div className="space-y-1">
                <p className="text-3xl font-heading font-black text-on-background tracking-tighter">12+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 leading-none">Active KKKS</p>
              </div>
              <div className="h-8 w-px bg-outline-variant/20" />
              <div className="space-y-1">
                <p className="text-3xl font-heading font-black text-on-background tracking-tighter">Real-time</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 leading-none">Sync Status</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            {/* Visual Representation of Dashboard */}
            <div className="relative z-10 p-4 bg-surface-container/50 backdrop-blur-2xl rounded-[3rem] border border-outline-variant/20 shadow-2xl">
              <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-error/20" />
                    <div className="w-3 h-3 rounded-full bg-primary/20" />
                    <div className="w-3 h-3 rounded-full bg-tertiary/20" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/20">Operational Preview</div>
                </div>
                
                <div className="space-y-6">
                  {[
                    { label: "Stability Index", value: 92, color: "bg-tertiary" },
                    { label: "Community Support", value: 85, color: "bg-primary" },
                    { label: "Regulatory Compliance", value: 78, color: "bg-secondary" }
                  ].map((stat, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        <span>{stat.label}</span>
                        <span>{stat.value}%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.value}%` }}
                          transition={{ delay: 1 + i * 0.2, duration: 1.5 }}
                          className={cn("h-full rounded-full", stat.color)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 p-6 bg-primary/5 rounded-[1.5rem] border border-primary/10">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-on-primary">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-background">Laporan Terverifikasi</p>
                      <p className="text-[10px] text-on-surface-variant opacity-60">Status sinkronisasi data aman.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Blurs under the visual */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-tertiary/20 rounded-full blur-[100px] -z-10" />
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-surface-container-low/30 backdrop-blur-3xl relative">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Key Capabilities</h2>
            <p className="text-4xl md:text-5xl font-heading font-extrabold text-on-background tracking-tighter leading-tight text-balance">
              Infrastruktur Digital untuk Kedaulatan <span className="text-primary">Energi Aceh</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="text-primary" />,
                title: "Analytics Eksekutif",
                desc: "Visualisasi data real-time untuk pengambilan keputusan strategis oleh pimpinan."
              },
              {
                icon: <ClipboardCheck className="text-tertiary" />,
                title: "Compliance Hub",
                desc: "Portal terpadu untuk memastikan KKKS mematuhi seluruh regulasi yang berlaku."
              },
              {
                icon: <Users className="text-secondary" />,
                title: "Community Insight",
                desc: "Pengumpulan suara publik untuk menjaga keharmonisan hubungan sosial di sekitar wilayah kerja."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 bg-surface-container-lowest rounded-[2.5rem] border border-outline-variant/10 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-500"
              >
                <div className="h-14 w-14 rounded-2xl bg-surface-container flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-heading font-extrabold text-on-background mb-4">{feature.title}</h3>
                <p className="text-sm font-medium text-on-surface-variant leading-relaxed opacity-70">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Public Ecosystem Section */}
      <section id="ecosystem" className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Public Portal</h2>
              <p className="text-4xl md:text-6xl font-heading font-extrabold text-on-background tracking-tighter leading-[0.95]">
                Dukungan <span className="text-primary">Masyarakat</span>, Pondasi Keberlanjutan.
              </p>
              <p className="text-on-surface-variant font-medium text-lg leading-relaxed max-w-xl opacity-80">
                Kami percaya bahwa transparansi adalah kunci. Melalui portal publik, setiap stakeholder dapat berpartisipasi dalam menjaga hubungan kerja sama yang sehat melalui pengiriman data survey indikator kinerja.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Pengisian data survey tanpa perlu akun",
                "Metodologi pengumpulan data transparan",
                "Umpan balik langsung ke sistem monitoring",
                "Integrasi kedaulatan daerah"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-sm font-bold text-on-background">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ChevronRight size={14} />
                  </div>
                  {item}
                </div>
              ))}
            </div>

            <Link href="/public/surveys/new">
              <button className="flex items-center gap-3 px-10 py-5 rounded-full bg-on-background text-background font-heading font-black text-sm hover:opacity-90 active:scale-95 transition-all">
                Mulai Survey Sekarang
                <ArrowRight size={18} />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6 relative">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)] blur-3xl opacity-[0.03] scale-150" />
             <div className="space-y-6">
                <div className="p-8 bg-surface-container-low rounded-[2rem] border border-outline-variant/10 shadow-sm space-y-4">
                   <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Building2 size={20} />
                   </div>
                   <p className="text-xs font-black uppercase tracking-widest text-on-background">Regional KKKS</p>
                   <p className="text-[10px] font-medium text-on-surface-variant opacity-60 leading-relaxed">Monitoring entitas kerja sama di wilayah Aceh.</p>
                </div>
                <div className="p-8 bg-surface-container-low rounded-[2rem] border border-outline-variant/10 shadow-sm space-y-4 translate-x-8">
                   <div className="h-10 w-10 bg-tertiary/10 rounded-lg flex items-center justify-center text-tertiary">
                      <ShieldCheck size={20} />
                   </div>
                   <p className="text-xs font-black uppercase tracking-widest text-on-background">Governance</p>
                   <p className="text-[10px] font-medium text-on-surface-variant opacity-60 leading-relaxed">Menjamin kepatuhan terhadap standar nasional.</p>
                </div>
             </div>
             <div className="space-y-6 pt-12">
                <div className="p-8 bg-surface-container-low rounded-[2rem] border border-outline-variant/10 shadow-sm space-y-4">
                   <div className="h-10 w-10 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                      <Users size={20} />
                   </div>
                   <p className="text-xs font-black uppercase tracking-widest text-on-background">Transparency</p>
                   <p className="text-[10px] font-medium text-on-surface-variant opacity-60 leading-relaxed">Akses data terbuka untuk kepentingan publik.</p>
                </div>
                <div className="p-8 bg-surface-container-low rounded-[2rem] border border-outline-variant/10 shadow-sm space-y-4 translate-x-8">
                   <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Activity size={20} />
                   </div>
                   <p className="text-xs font-black uppercase tracking-widest text-on-background">Impact</p>
                   <p className="text-[10px] font-medium text-on-surface-variant opacity-60 leading-relaxed">Mengukur dampak positif operasi energi.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-32 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto rounded-[3.5rem] bg-primary p-16 md:p-24 text-on-primary text-center space-y-12 relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(var(--primary-rgb),0.4)]"
        >
          {/* Decorative Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none" />

          <div className="relative space-y-6">
            <h2 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tighter leading-none">
              Siap untuk meningkatkan <br /> Transparansi Operasional?
            </h2>
            <p className="text-lg font-medium opacity-80 max-w-2xl mx-auto">
              Masuk ke dashboard internal untuk analisis mendalam atau berkontribusi melalui portal survey publik.
            </p>
          </div>

          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-6">
             <Link href="/dashboard">
                <button className="w-full sm:w-auto px-12 py-5 rounded-full bg-on-primary text-primary font-heading font-black text-sm hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-black/10">
                   Buka Dashboard Internal
                </button>
             </Link>
             <Link href="/public/surveys/new">
                <button className="group w-full sm:w-auto px-12 py-5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-on-primary font-heading font-black text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                   Portal Survey Publik
                   <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
             </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="space-y-6">
            <div className="flex items-center gap-3 justify-center md:justify-start">
               <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-on-primary">
                  <Globe size={18} strokeWidth={2.5} />
               </div>
               <span className="text-sm font-black uppercase tracking-widest text-on-background">Siperta</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 max-w-xs leading-relaxed">
              Institutional Compliance & Transparency Engine for Sovereign Energy Operations.
            </p>
          </div>

          <div className="flex gap-12">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Portal</p>
              <div className="flex flex-col gap-2">
                {["Public Survey", "Dashboard", "Ecosystem"].map((item) => (
                  <Link key={item} href={item === "Public Survey" ? "/public/surveys/new" : "/dashboard"} className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">{item}</Link>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Regional</p>
              <div className="flex flex-col gap-2">
                {["Aceh Timur", "Aceh Utara", "Aceh Barat"].map((item) => (
                  <span key={item} className="text-xs font-bold text-on-surface-variant/60">{item}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Disclaimer</p>
            <p className="text-[9px] font-bold text-on-surface-variant/40 leading-relaxed uppercase tracking-widest max-w-[200px]">
              © 2024 institutional engine. all rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
