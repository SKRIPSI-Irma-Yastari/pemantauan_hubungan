"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Globe, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  Home,
  Eye,
  EyeOff
} from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw authError
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Gagal masuk. Silakan periksa kredensial Anda.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-[0.03]" />
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-[600px] h-[600px] bg-tertiary/5 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group mb-6">
            <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-on-primary shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
              <Globe size={26} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <p className="text-lg font-black uppercase tracking-[0.2em] text-on-background leading-tight">Siperta</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary leading-tight">Institutional Engine</p>
            </div>
          </Link>
          <h1 className="text-3xl font-heading font-extrabold text-on-background tracking-tight">Selamat Datang Kembali</h1>
          <p className="text-on-surface-variant text-sm mt-2 font-medium opacity-70">Masuk ke portal internal untuk memantau data strategis.</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest/50 backdrop-blur-3xl border border-outline-variant/10 p-8 rounded-[2.5rem] shadow-2xl shadow-primary/5">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-error/10 border border-error/20 text-error text-xs font-bold"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-4">Email Instansi</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-surface-container rounded-2xl border border-outline-variant/5 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm font-medium transition-all"
                    placeholder="email@instansi.go.id"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Kata Sandi</label>
                  <button type="button" className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70 transition-opacity">Lupa?</button>
                </div>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-surface-container rounded-2xl border border-outline-variant/5 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm font-medium transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-background transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group relative flex items-center justify-center gap-3 py-4 rounded-2xl bg-primary text-on-primary font-heading font-black text-sm shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-70 disabled:translate-y-0"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Masuk Portal
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          <div className="mt-8 pt-8 border-t border-outline-variant/10 text-center">
            <p className="text-xs font-medium text-on-surface-variant/60">
              Belum memiliki akun?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Daftar Akun Baru
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
            <Home size={14} />
            Kembali ke Beranda
          </Link>
          <div className="h-4 w-px bg-outline-variant/20" />
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 leading-none">
            © 2024 Institutional Engine
          </p>
        </div>
      </motion.div>
    </div>
  )
}
