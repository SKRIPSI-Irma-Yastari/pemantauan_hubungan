"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export type Profile = {
  id: string
  email: string
  role: "bpma" | "stakeholder"
  full_name: string | null
  stakeholder_id: string | null
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()

          if (error) throw error
          setProfile(data)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [])

  return { profile, loading }
}
