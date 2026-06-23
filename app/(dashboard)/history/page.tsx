"use client"

import { useState, useEffect } from "react"
import { 
  History, 
  Search, 
  ChevronRight, 
  Calendar, 
  CloudDownload,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
  FileText,
  AlertCircle,
  MessageSquare,
  Users,
  Trash2
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteItem, setDeleteItem] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function fetchHistory() {
      try {
        setIsLoading(true)
        // Fetching from interaction_data table as the primary source of historical records
        const { data, error } = await supabase
          .from('interaction_data')
          .select('*, stakeholders(name)')
          .order('created_at', { ascending: false })

        if (error) throw error
        setHistoryItems(data || [])
      } catch (err: any) {
        console.error("Error fetching history:", err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return
    try {
      setIsDeleting(true)
      const { error } = await supabase
        .from('interaction_data')
        .delete()
        .eq('id', deleteItem.id)

      if (error) throw error

      setHistoryItems(prev => prev.filter(item => item.id !== deleteItem.id))
      setDeleteItem(null)
    } catch (err: any) {
      console.error("Error deleting history item:", err)
      alert("Gagal menghapus data: " + err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  const getInteractionIcon = (jenis: string) => {
    switch (jenis) {
      case 'Rapat': return <Calendar size={20} />
      case 'Laporan': return <FileText size={20} />
      case 'Komunikasi': return <MessageSquare size={20} />
      case 'Partisipasi': return <Users size={20} />
      default: return <History size={20} />
    }
  }

  return (
    <div className="p-8 space-y-10 max-w-[1200px] mx-auto min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase mb-2">
            <span>Analytics</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">Historical Log</span>
          </nav>
          <h1 className="text-3xl font-heading font-extrabold text-on-background tracking-tight">Activity Timeline</h1>
          <p className="text-on-surface-variant font-medium text-sm mt-1 max-w-xl">
            Retrospective view of institutional performance entries and relationship classification cycles.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-surface-container-high px-4 py-2.5 rounded-xl border border-outline-variant/10 text-sm font-bold transition-all hover:bg-surface-variant">
            <CloudDownload className="h-4 w-4" />
            Export Archive
          </button>
        </div>
      </div>

      {/* Main Timeline Section */}
      <div className="relative">
        {/* Timeline Vertical Line */}
        <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-primary/40 via-outline-variant/20 to-transparent hidden md:block" />

        <div className="space-y-12">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary opacity-40" />
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Reconstructing Data Stream...</p>
            </div>
          ) : error ? (
            <div className="p-8 bg-error-container/10 border border-error/20 rounded-3xl flex items-center gap-4 text-error">
              <AlertCircle size={24} />
              <div>
                <p className="font-bold">System Sync Failure</p>
                <p className="text-sm opacity-80">{error}</p>
              </div>
            </div>
          ) : historyItems.length === 0 ? (
            <div className="text-center py-20 bg-surface-container-low rounded-[3rem] border border-dashed border-outline-variant/20">
              <History size={48} className="mx-auto mb-4 text-on-surface-variant/20" />
              <p className="font-heading font-bold text-on-background">No records found</p>
              <p className="text-sm text-on-surface-variant opacity-60">Activity log is currently empty.</p>
            </div>
          ) : (
            historyItems.map((item, idx) => {
              const date = new Date(item.created_at)
              const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
              const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              const isEven = idx % 2 === 0

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={cn(
                    "relative flex flex-col md:flex-row gap-8 items-start md:items-center",
                    isEven ? "md:flex-row-reverse" : ""
                  )}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                    <div className="h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                  </div>

                  {/* Date Label (Desktop) */}
                  <div className={cn(
                    "hidden md:block w-full text-right px-8",
                    isEven ? "text-right" : "text-left"
                  )}>
                    <div className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest mb-1">
                      {dateStr}
                    </div>
                    <div className="text-sm font-heading font-bold text-on-background">
                      {timeStr}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="w-full pl-12 md:pl-0">
                    <div className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/5 shadow-sm hover:shadow-md transition-shadow group">
                      {/* Mobile Date/Time */}
                      <div className="md:hidden flex items-center gap-2 mb-4 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
                        <Calendar size={12} /> {dateStr}
                        <Clock size={12} className="ml-2" /> {timeStr}
                      </div>

                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            {getInteractionIcon(item.jenis_interaksi)}
                          </div>
                          <div>
                            <h4 className="font-heading font-bold text-on-background">{item.stakeholders?.name || 'KKKS'}</h4>
                            <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-tight">{item.jenis_interaksi} • {item.detail_aktivitas}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setDeleteItem(item)}
                          className="h-8 w-8 rounded-full border border-error/15 flex items-center justify-center text-error/60 hover:text-on-error hover:bg-error transition-all cursor-pointer active:scale-95"
                          title="Hapus log interaksi"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 bg-surface-container-low rounded-xl">
                        <div>
                          <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest mb-1">Keterangan</p>
                          <span className="text-xs font-bold text-on-surface leading-relaxed">{item.keterangan || '-'}</span>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest mb-1">Status Hubungan</p>
                          <span className={cn(
                            "px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider inline-block",
                            item.status === 'Harmonis' ? "bg-tertiary/10 text-tertiary border border-tertiary/20" : "bg-error/10 text-error border border-error/20"
                          )}>
                            {item.status || 'Harmonis'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md overflow-hidden rounded-[2rem] border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-2xl relative animate-in fade-in duration-200"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-error/10 flex items-center justify-center text-error flex-shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-on-background">Hapus Log Interaksi?</h3>
                <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                  Tindakan ini akan menghapus log interaksi <strong>{deleteItem.stakeholders?.name || 'KKKS'}</strong> secara permanen. Hal ini dapat mengubah status kestabilan hubungan kelembagaan yang dihitung.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-low p-4 rounded-2xl text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Stakeholder:</span>
                <span className="font-bold text-on-surface">{deleteItem.stakeholders?.name || 'KKKS'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Aktivitas:</span>
                <span className="font-bold text-on-surface">{deleteItem.jenis_interaksi} - {deleteItem.detail_aktivitas}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Periode:</span>
                <span className="font-bold text-on-surface">{deleteItem.bulan || ''} {deleteItem.tahun || ''}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteItem(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-95 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="flex items-center gap-2 rounded-xl bg-error px-6 py-2.5 text-sm font-bold text-on-error shadow-lg shadow-error/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {isDeleting ? "Menghapus..." : "Ya, Hapus Data"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Decorative Gradient */}
      <div className="fixed inset-0 -z-20 pointer-events-none isolate opacity-10">
        <div className="absolute top-0 right-0 h-[800px] w-[800px] bg-gradient-to-br from-primary via-transparent to-transparent blur-[150px]" />
      </div>
    </div>
  )
}
