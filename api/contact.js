import { z } from 'zod'

const schema = z.object({
  url: z.string().url().max(500),
  name: z.string().trim().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().trim().min(7).max(30),
  message: z.string().trim().min(10).max(4000),
  service: z.string().trim().min(2).max(100),
  duration: z.string().trim().max(100),
  industry: z.string().trim().max(100),
  location: z.string().trim().min(2).max(160),
  startDate: z.string().max(40),
  consent: z.literal(true),
  website: z.string().max(0).optional()
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Please check the highlighted fields and try again.' })
  const webhook = process.env.GLIDE_WEBHOOK_URL
  const token = process.env.GLIDE_WEBHOOK_TOKEN
  if (!webhook || !token) return res.status(503).json({ error: 'Online requests are being configured. Please call 1-800-205-6106.' })
  const { website: _honeypot, ...data } = parsed.data
  try {
    const upstream = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}`, 'x-glide-token': token },
      body: JSON.stringify({ data })
    })
    if (!upstream.ok) throw new Error(`Webhook returned ${upstream.status}`)
    return res.status(200).json({ ok: true })
  } catch {
    return res.status(502).json({ error: 'Your request could not be sent. Please call 1-800-205-6106.' })
  }
}
