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
    let isMounted = true

    async function getProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user

        if (user && isMounted) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()

          if (error) throw error
          if (isMounted) setProfile(data)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    getProfile()

    return () => {
      isMounted = false
    }
  }, [])

  return { profile, loading }
}
