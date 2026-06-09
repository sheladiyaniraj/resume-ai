import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { bullet } = await req.json() as { bullet: string }
  if (!bullet?.trim()) return NextResponse.json({ error: 'No bullet provided' }, { status: 400 })

  const prompt = `You are an expert resume writer. Rewrite this resume bullet point into 3 stronger variants.

Original bullet: "${bullet}"

Rules for each variant:
- Start with a strong, specific action verb (Led, Architected, Reduced, Increased, etc.)
- Include a quantifiable metric if one can be reasonably inferred or is present
- Follow structure: [Action verb] + [what/how] + [impact/result]
- Keep it to 1-2 lines maximum
- Make each variant distinct in approach/emphasis

Return ONLY a valid JSON array of 3 strings, no other text:
["variant 1", "variant 2", "variant 3"]`

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '[]'
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) return NextResponse.json({ error: 'Parse error' }, { status: 500 })

  const variants = JSON.parse(jsonMatch[0]) as string[]

  await supabase.from('rb_ai_usage').insert({ user_id: user.id, action: 'rewrite' })

  return NextResponse.json({ variants })
}
