import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' })

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, password_hash')
    .eq('email', email)
    .limit(1)
    .single()

  if (error) return res.status(401).json({ error: 'Invalid email or password' })

  const match = await bcrypt.compare(password, data.password_hash)
  if (!match) return res.status(401).json({ error: 'Invalid email or password' })

  // Create a session mechanism (cookie/JWT) here. For demo:
  return res.status(200).json({ userId: data.id })
}