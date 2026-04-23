"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Users, 
  FileEdit, 
  Network, 
  BarChart3, 
  History, 
  Settings, 
  LogOut,
  Library
} from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Stakeholders", href: "/stakeholders", icon: Users },
  { name: "Data Input", href: "/data-input", icon: FileEdit },
  { name: "Algorithms", href: "/algorithms", icon: Network },
  { name: "Classification", href: "/classification", icon: BarChart3 },
  { name: "History", href: "/history", icon: History },
  { name: "Survey Input", href: "/surveys/new", icon: FileEdit },
  { name: "Survey Management", href: "/surveys", icon: Library },
]

import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-outline-variant/20 bg-surface-container-low transition-all duration-300 lg:static">
      <div className="flex h-full flex-col py-8 px-4">
        {/* Logo Section */}
        <div className="px-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary shadow-lg shadow-primary/20">
              <Library className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-extrabold leading-none tracking-tight text-primary">
                BPMA
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
                Institutional Luminary
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-surface-container-lowest text-primary shadow-sm border-r-4 border-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-primary" : "text-on-surface-variant/60 group-hover:text-on-surface"
                )} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto space-y-1.5 px-2 pt-6 border-t border-outline-variant/10">
          <Link
            href="/settings"
            className={cn(
              "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
              pathname === "/settings"
                ? "bg-surface-container-lowest text-primary"
                : "text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            <Settings className="h-5 w-5 opacity-60 group-hover:opacity-100" />
            Settings
          </Link>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-error hover:bg-error-container/10 transition-all cursor-pointer active:scale-95"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}
