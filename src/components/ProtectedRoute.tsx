import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom' // Added Outlet
import { supabase } from '../integrations/supabase/client' // Correct import path

type Props = { children: JSX.Element }

export default function ProtectedRoute({ children }: Props): JSX.Element | null {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    let mounted = true

    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!mounted) return
      setAuthenticated(!!session)
      setLoading(false)
    }

    check()

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      supabase.auth.getSession().then(({ data }) => {
        if (!mounted) return
        setAuthenticated(!!data.session)
      })
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  if (loading) return null
  if (!authenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}