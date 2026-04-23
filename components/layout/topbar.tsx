"use client"

import { Search, Bell, HelpCircle, ChevronDown, LogOut, User } from "lucide-react"
import { useProfile } from "@/hooks/use-profile"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function TopBar() {
  const { profile } = useProfile()
  const router = useRouter()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant/10 bg-background/80 px-8 backdrop-blur-xl transition-all duration-300">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant opacity-60" />
          <input
            type="text"
            placeholder="Search stakeholders or analysis logs..."
            className="h-10 w-full rounded-xl bg-surface-container-low pl-10 pr-4 text-sm outline-none transition-all placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1">
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high active:scale-95">
            <Bell className="h-5 w-5" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high active:scale-95">
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="h-8 w-px bg-outline-variant/20" />

        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 rounded-xl p-1.5 transition-all hover:bg-surface-container-high active:scale-95"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none text-primary">
                {profile?.full_name || "User"}
              </p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-on-surface-variant/70">
                {profile?.role === 'bpma' ? 'BPMA Regulator' : 'Stakeholder KKKS'}
              </p>
            </div>
            <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-primary-container bg-surface-container shadow-sm flex items-center justify-center text-primary">
              <User size={20} />
            </div>
            <ChevronDown className={cn("h-4 w-4 text-on-surface-variant transition-transform", isProfileOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-surface-container-lowest p-2 border border-outline-variant/10 shadow-xl"
                >
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-error hover:bg-error/5 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
