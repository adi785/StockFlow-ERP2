import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }

    // On success, redirect to app home
    router.push('/')
  }

  return (
    <main style={{ maxWidth: 420, margin: '40px auto', padding: '0 20px' }}>
      <h1>Sign in</h1>
      <form onSubmit={handleLogin}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label style={{ display: 'block', marginTop: 12 }}>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p style={{ marginTop: 12 }}>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </main>
  )
}