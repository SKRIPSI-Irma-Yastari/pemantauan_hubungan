"use client"

import { useState } from "react"
import { 
  Settings, 
  User, 
  Bell, 
  Zap, 
  Globe, 
  Shield, 
  ChevronRight,
  Save,
  RotateCcw,
  SlidersHorizontal,
  Bot,
  Mail,
  Lock
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "profile", name: "Account Profile", icon: User },
  { id: "notifications", name: "Communications", icon: Bell },
  { id: "algorithm", name: "Logic Parameters", icon: Zap },
  { id: "security", name: "Secure Access", icon: Shield },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1500)
  }

  return (
    <div className="p-8 space-y-10 max-w-[1200px] mx-auto min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase mb-2">
            <span>Control Center</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">System Settings</span>
          </nav>
          <h1 className="text-3xl font-heading font-extrabold text-on-background tracking-tight">Configuration Hub</h1>
          <p className="text-on-surface-variant font-medium text-sm mt-1 max-w-xl">
            Fine-tune system behavior, algorithmic thresholds, and administrative preferences.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? <RotateCcw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? "Synchronizing..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Navigation Tabs */}
        <div className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300",
                activeTab === tab.id
                  ? "bg-primary text-on-primary shadow-lg shadow-primary/10"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              )}
            >
              <tab.icon size={18} />
              {tab.name}
              {activeTab === tab.id && (
                <motion.div layoutId="active-pill" className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="lg:col-span-9 bg-surface-container-lowest rounded-[2.5rem] p-10 border border-outline-variant/10 shadow-sm relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-10"
            >
              {activeTab === "profile" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-6 pb-8 border-b border-outline-variant/10">
                    <div className="h-24 w-24 rounded-full border-4 border-primary-container bg-surface-container overflow-hidden">
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5AHKZ6zpCQxCzitHIhXtZPkXxg9DypxslaWjqeF038Z55COOP8AWPJKX7QFjjabgzfMeGn7zGIkDQgvTH2MIojd2orMoVkv7Y9nHIr6vz5C7QyEqKvMJ6yCg1ANCuzHpZVJnalLOZD-DmHIsRujejw_C-Zw3pZwktljML1LMvKm-_k-cjs8uByFpObPTAsWas-SKYso09PccQbMiKIJFthIvPGThegXesf-xxt7s3_gnQHPBBCKgJViizaMH6qSlQW30PocBTcLgn" 
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-on-background">Administrator</h3>
                      <p className="text-sm text-on-surface-variant">BPMA Central Command</p>
                      <button className="mt-3 text-xs font-bold text-primary hover:underline uppercase tracking-widest">Update Photo</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.1em] ml-2">Full Identity</label>
                       <input type="text" defaultValue="Central Administrator" className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.1em] ml-2">Primary Email</label>
                       <div className="relative">
                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/40" />
                         <input type="email" defaultValue="admin@bpma.go.id" className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.1em] ml-2">Location / Base</label>
                     <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/40" />
                        <input type="text" defaultValue="Banda Aceh, Region 01" className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                     </div>
                  </div>
                </div>
              )}

              {activeTab === "algorithm" && (
                <div className="space-y-8">
                  <div className="p-6 bg-primary-container/20 border border-primary/10 rounded-3xl flex items-start gap-4">
                    <Bot className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-bold text-primary text-sm">CART Algorithm Calibration</h4>
                      <p className="text-xs text-primary/80 mt-1 leading-relaxed">Adjust the logic thresholds for classifying institutional relationships. Changes here affect the dynamic Status generation in the Registry.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center px-2">
                        <label className="text-xs font-bold text-on-background">Production Flow Threshold (Avg.)</label>
                        <span className="text-xs font-bold text-primary">850 MBPD</span>
                      </div>
                      <input type="range" className="w-full accent-primary h-1.5 bg-surface-container rounded-full" />
                      <div className="flex justify-between text-[10px] font-bold text-on-surface-variant/40">
                        <span>400 MBPD</span>
                        <span>1200 MBPD</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center px-2">
                        <label className="text-xs font-bold text-on-background">Maintenance Lag Sensitivity</label>
                        <span className="text-xs font-bold text-primary">12 Hours</span>
                      </div>
                      <input type="range" className="w-full accent-primary h-1.5 bg-surface-container rounded-full" />
                      <div className="flex justify-between text-[10px] font-bold text-on-surface-variant/40">
                        <span>2 Hours</span>
                        <span>48 Hours</span>
                      </div>
                    </div>

                    <div className="pt-6 grid grid-cols-2 gap-4">
                      <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/5">
                        <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase mb-2">Stability Bias</p>
                        <div className="flex items-center gap-2">
                          <SlidersHorizontal size={14} className="text-primary" />
                          <span className="text-xs font-bold">Standard Distribution</span>
                        </div>
                      </div>
                      <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/5">
                        <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase mb-2">Class Depth</p>
                        <div className="flex items-center gap-2">
                          <SlidersHorizontal size={14} className="text-primary" />
                          <span className="text-xs font-bold">Recursive (Max: 5)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6">
                   <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-outline-variant/5">
                      <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant">
                          <Mail size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">Email Digest</p>
                          <p className="text-[10px] font-medium text-on-surface-variant">Weekly summary of stakeholder performance</p>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                        <div className="h-4 w-4 bg-white rounded-full ml-auto" />
                      </div>
                   </div>

                   <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-outline-variant/5 opacity-40">
                      <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant">
                          <Bell size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">Push Notifications</p>
                          <p className="text-[10px] font-medium text-on-surface-variant">Real-time alerts for critical score drops</p>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-outline-variant/20 rounded-full relative p-1">
                        <div className="h-4 w-4 bg-white rounded-full" />
                      </div>
                   </div>
                </div>
              )}

              {activeTab === "security" && (
                 <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.1em] ml-2">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/40" />
                        <input type="password" placeholder="••••••••" className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                      </div>
                   </div>
                   <button className="text-xs font-bold text-primary flex items-center gap-2 px-2 py-1">
                     <Shield size={14} />
                     Enable Two-Factor Authentication
                   </button>
                 </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Accent */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-[80px]" />
        </div>
      </div>
    </div>
  )
}
