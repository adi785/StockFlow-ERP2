import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function SignupPage(): JSX.Element {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }

    setMessage('Signup successful. Please check your email for confirmation if required.')
  }

  return (
    <main style={{ maxWidth: 420, margin: '48px auto', padding: '0 16px' }}>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginTop: 12 }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 6 }}
          />
        </label>

        <label style={{ display: 'block', marginTop: 12 }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 6 }}
          />
        </label>

        {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
        {message && <div style={{ color: 'green', marginTop: 12 }}>{message}</div>}

        <button type="submit" disabled={loading} style={{ marginTop: 16, padding: '8px 12px' }}>
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </main>
  )
}