"use client"

import { Search, Bell, HelpCircle, ChevronDown } from "lucide-react"

export function TopBar() {
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

        <button className="flex items-center gap-3 rounded-xl p-1.5 transition-all hover:bg-surface-container-high active:scale-95">
          <div className="text-right">
            <p className="text-sm font-bold leading-none text-primary">Administrator</p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-on-surface-variant/70">
              BPMA Central
            </p>
          </div>
          <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-primary-container bg-surface-container shadow-sm">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5AHKZ6zpCQxCzitHIhXtZPkXxg9DypxslaWjqeF038Z55COOP8AWPJKX7QFjjabgzfMeGn7zGIkDQgvTH2MIojd2orMoVkv7Y9nHIr6vz5C7QyEqKvMJ6yCg1ANCuzHpZVJnalLOZD-DmHIsRujejw_C-Zw3pZwktljML1LMvKm-_k-cjs8uByFpObPTAsWas-SKYso09PccQbMiKIJFthIvPGThegXesf-xxt7s3_gnQHPBBCKgJViizaMH6qSlQW30PocBTcLgn" 
              alt="Admin Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <ChevronDown className="h-4 w-4 text-on-surface-variant" />
        </button>
      </div>
    </header>
  )
}
