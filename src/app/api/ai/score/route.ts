import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { ResumeContent } from '@/types/resume'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: subscription } = await supabase
    .from('rb_subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .single()

  if (subscription?.plan !== 'pro' || subscription?.status !== 'active') {
    return NextResponse.json({ error: 'ATS scoring requires Pro plan' }, { status: 403 })
  }

  const { content, jobDescription } = await req.json() as { content: ResumeContent; jobDescription: string }

  const resumeText = [
    content.summary,
    ...content.experience.flatMap(e => [e.title, e.company, ...e.bullets]),
    ...content.skills.categories.map(c => c.skills),
    ...content.projects.flatMap(p => [p.name, p.technologies, ...p.bullets]),
  ].filter(Boolean).join(' ')

  const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze this resume against the job description.

Resume text:
${resumeText}

Job Description:
${jobDescription}

Analyze and return a JSON object with this exact structure:
{
  "score": <integer 0-100>,
  "missingKeywords": [<up to 8 important keywords/phrases from JD missing from resume>],
  "presentKeywords": [<up to 8 important keywords/phrases from JD present in resume>],
  "fixes": [<exactly 3 specific, actionable improvements as strings>],
  "breakdown": {
    "keywordMatch": <integer 0-100, percentage of key JD terms present in resume>,
    "formatting": <integer 0-100, ATS-friendliness of structure>,
    "completeness": <integer 0-100, how complete and detailed the resume is>
  }
}

Return ONLY valid JSON, no other text.`

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return NextResponse.json({ error: 'Parse error' }, { status: 500 })

  const feedback = JSON.parse(jsonMatch[0])
  await supabase.from('rb_ai_usage').insert({ user_id: user.id, action: 'score' })

  return NextResponse.json({ feedback })
}
