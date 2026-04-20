"use client"

import { 
  BarChart3, 
  Download, 
  Search, 
  Lightbulb, 
  ChevronRight,
  Workflow,
  AlertTriangle,
  Filter,
  Activity,
  Zap,
  ShieldCheck,
  AlertCircle
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { StabilityGauge } from "@/components/ui/stability-gauge"

const performanceMetrics = [
  { label: "Accuracy", value: 98.4, color: "var(--color-primary)" },
  { label: "Precision", value: 97.1, color: "var(--color-tertiary)" },
  { label: "Recall", value: 99.0, color: "var(--color-secondary)" },
]

const decisionRules = [
  { 
    id: "01", 
    title: "High Stability", 
    logic: [
      { type: "IF", text: "Production_Flow > 850 MBPD" },
      { type: "AND", text: "Maintenance_Lag < 12 Hours" },
      { type: "THEN", text: "STATUS = Harmonis", variant: "success" }
    ]
  },
  { 
    id: "02", 
    title: "Critical Pressure", 
    logic: [
      { type: "IF", text: "Reservoir_Pressure < 2100 PSI" },
      { type: "AND", text: "Water_Cut > 15%" },
      { type: "THEN", text: "STATUS = Kurang Harmonis", variant: "error" }
    ]
  },
  { 
    id: "03", 
    title: "Seasonal Adjustment", 
    logic: [
      { type: "IF", text: "Gas_Flare_Volume < 50 MMSCFD" },
      { type: "THEN", text: "STATUS = Harmonis", variant: "success" }
    ]
  }
]

export default function ClassificationPage() {
  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-on-background">
            Classification & Evaluation
          </h2>
          <p className="mt-1 text-on-surface-variant font-medium">
            Model performance benchmarks and derived decision logic.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-surface-container-high px-4 py-2.5 text-sm font-bold text-on-surface transition-all hover:bg-surface-variant active:scale-95">
          <Search className="h-4 w-4" />
          Filter Parameters
        </button>
      </motion.div>

      {/* Hero Performance Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Overall Index Gauge */}
        <section className="lg:col-span-4 rounded-3xl bg-surface-container-lowest p-8 shadow-sm border border-outline-variant/10 flex flex-col items-center justify-center isolate relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <StabilityGauge score={94.2} label="Overall Accuracy" status="HARMONIOUS" className="scale-110" />
        </section>

        {/* Model Metrics */}
        <section className="lg:col-span-8 rounded-3xl bg-surface-container-low p-8 shadow-sm flex flex-col">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h3 className="font-heading text-xl font-bold text-on-surface">Model Performance</h3>
              <p className="text-xs font-bold text-on-surface-variant/60 tracking-widest mt-1 uppercase">Algorithm: CART (Decision Tree)</p>
            </div>
            <div className="text-right flex flex-col gap-1 items-end">
              <span className="text-[10px] font-bold text-on-surface-variant/40 tracking-widest uppercase">Latest Run</span>
              <div className="px-3 py-1 rounded-lg bg-surface-container-lowest text-xs font-bold text-on-surface border border-outline-variant/10">
                Oct 24, 2023 · 14:02
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
            {performanceMetrics.map((met) => (
              <div key={met.label} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/5 shadow-sm">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant/60 mb-2">{met.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-extrabold text-on-surface">{met.value}</span>
                  <span className="text-sm font-bold opacity-30">%</span>
                </div>
                <div className="mt-6 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${met.value}%` }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: met.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Decision Rules Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-heading text-xl font-bold text-on-surface">Decision Rules (IF-THEN)</h3>
            <button className="text-[10px] font-bold text-primary flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors uppercase tracking-widest">
              <Download className="h-4 w-4" /> EXPORT LOGIC
            </button>
          </div>

          <div className="space-y-4">
            {decisionRules.map((rule) => (
              <motion.div 
                key={rule.id}
                whileHover={{ x: 4 }}
                className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 transition-all hover:shadow-md hover:border-primary/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    rule.id === "02" ? "bg-error-container/20" : "bg-primary-container/40"
                  )}>
                    {rule.id === "02" ? <AlertCircle className="h-4 w-4 text-error" /> : <ShieldCheck className="h-4 w-4 text-primary" />}
                  </div>
                  <span className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-[0.1em]">Rule #{rule.id} \u00b7 {rule.title}</span>
                </div>
                
                <div className="space-y-1.5 bg-surface p-5 rounded-xl font-mono text-sm border border-outline-variant/5">
                  {rule.logic.map((line, idx) => (
                    <p key={idx} className="flex gap-3">
                      <span className={cn(
                        "font-bold w-12",
                        line.type === "IF" && "text-primary",
                        line.type === "AND" && "text-primary-dim",
                        line.type === "THEN" && (line.variant === "success" ? "text-tertiary" : "text-error")
                      )}>
                        {line.type}
                      </span>
                      <span className={cn(
                        "font-medium",
                        line.type === "THEN" ? "font-bold text-on-surface" : "text-on-surface-variant"
                      )}>
                        {line.text}
                      </span>
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Confusion Matrix & Insights */}
        <div className="lg:col-span-2 space-y-8">
          <section className="rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/10 overflow-hidden">
            <div className="p-5 bg-surface-container-low/50 border-b border-outline-variant/10 flex justify-between items-center">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Confusion Matrix</span>
              <span className="text-[10px] text-on-surface-variant italic font-medium">n = 1,450 records</span>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-3 gap-1 bg-outline-variant/10 rounded-xl overflow-hidden text-center isolate">
                {/* Headers */}
                <div className="bg-surface-container-low/20" />
                <div className="bg-surface-container-low p-3">
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-tighter">Pred. Harmonis</span>
                </div>
                <div className="bg-surface-container-low p-3">
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-tighter">Pred. Kurang</span>
                </div>

                {/* Row 1 */}
                <div className="bg-surface-container-low p-3 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-tighter rotate-[-90deg]">Act. Harmonis</span>
                </div>
                <div className="bg-tertiary-container/30 p-8">
                  <span className="font-heading text-2xl font-extrabold text-tertiary">920</span>
                  <p className="text-[8px] font-bold text-tertiary mt-0.5">TRUE POS.</p>
                </div>
                <div className="bg-surface-container-low/10 p-8">
                  <span className="font-heading text-2xl font-extrabold text-on-surface-variant opacity-40">12</span>
                  <p className="text-[8px] font-bold text-on-surface-variant opacity-40 mt-0.5">FALSE NEG.</p>
                </div>

                {/* Row 2 */}
                <div className="bg-surface-container-low p-3 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-tighter rotate-[-90deg]">Act. Kurang</span>
                </div>
                <div className="bg-surface-container-low/10 p-8">
                  <span className="font-heading text-2xl font-extrabold text-on-surface-variant opacity-40">8</span>
                  <p className="text-[8px] font-bold text-on-surface-variant opacity-40 mt-0.5">FALSE POS.</p>
                </div>
                <div className="bg-error-container/20 p-8">
                  <span className="font-heading text-2xl font-extrabold text-error">510</span>
                  <p className="text-[8px] font-bold text-error mt-0.5">TRUE NEG.</p>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-outline-variant/10 bg-surface-container-low/10 space-y-3">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-on-surface-variant">F1-Score</span>
                <span className="text-on-surface font-bold">0.985</span>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-on-surface-variant">AUC-ROC</span>
                <span className="text-on-surface font-bold">0.992</span>
              </div>
            </div>
          </section>

          {/* Technical Insight Box */}
          <section className="rounded-3xl bg-primary p-8 text-on-primary shadow-2xl shadow-primary/20 relative isolate group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-all" />
            
            <div className="flex items-start gap-3 mb-5">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/20">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight">Technical Insight</h4>
                <p className="text-[10px] text-primary-fixed opacity-70 uppercase tracking-widest mt-0.5">Optimization Hint</p>
              </div>
            </div>
            
            <p className="text-sm leading-relaxed text-blue-100 font-medium">
              Model CART menunjukkan stabilitas tinggi pada variabel <span className="font-bold text-white underline decoration-blue-400">Production_Flow</span>. 
              Resiko klasifikasi salah hanya terjadi pada ambang batas transisi pressure (2100-2150 PSI).
            </p>

            <button className="mt-8 w-full rounded-xl bg-white/10 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-white/20 hover:scale-[1.02] active:scale-95">
              View Full Validation Report
            </button>
          </section>
        </div>
      </div>

      {/* Background Ambient Shapes */}
      <div className="fixed inset-0 -z-10 pointer-events-none isolate opacity-30">
        <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-gradient-to-br from-primary-container/20 to-transparent blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-gradient-to-tr from-tertiary-container/20 to-transparent blur-[120px]" />
      </div>
    </div>
  )
}
