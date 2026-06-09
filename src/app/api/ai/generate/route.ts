import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { ResumeContent } from '@/types/resume'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check usage limits
  const { data: subscription } = await supabase
    .from('rb_subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .single()

  const isPro = subscription?.plan === 'pro' && subscription?.status === 'active'

  if (!isPro) {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    const { count } = await supabase
      .from('rb_ai_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('action', 'generate')
      .gte('created_at', startOfMonth.toISOString())

    if ((count ?? 0) >= 3) {
      return NextResponse.json({ error: 'Monthly AI generation limit reached. Upgrade to Pro for unlimited.' }, { status: 429 })
    }
  }

  const { content, jobDescription } = await req.json() as { content: ResumeContent; jobDescription: string }

  const prompt = `You are an expert resume writer and ATS optimization specialist.

Given a candidate's existing resume content and a job description, rewrite the resume to be optimally tailored for this specific job.

Current resume content (JSON):
${JSON.stringify(content, null, 2)}

Job Description:
${jobDescription}

Instructions:
1. Rewrite the "summary" to be 2-3 sentences highlighting the most relevant experience and skills for THIS specific job
2. For each experience item, rewrite the "bullets" array to:
   - Use strong action verbs
   - Include quantifiable metrics where plausible (keep them realistic based on existing info)
   - Mirror keywords from the job description naturally
   - Follow the format: [Action verb] + [what you did] + [result/impact]
3. Keep all other fields (contact, company names, dates, titles, education) exactly the same
4. Return ONLY valid JSON matching the exact structure of the input

Return the complete updated resume content as JSON, nothing else.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
  }

  const newContent = JSON.parse(jsonMatch[0]) as ResumeContent

  // Track usage
  await supabase.from('rb_ai_usage').insert({ user_id: user.id, action: 'generate' })

  return NextResponse.json({ content: newContent })
}
