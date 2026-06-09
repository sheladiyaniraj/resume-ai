import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { ResumeContent } from '@/types/resume'
import { generateId } from '@/lib/utils'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { roughExperience, jobDescription } = await req.json() as { roughExperience: string; jobDescription?: string }

  const prompt = `You are an expert resume writer. Convert this rough experience description into a structured, professional resume.

Rough experience:
${roughExperience}

${jobDescription ? `Target job description:\n${jobDescription}` : ''}

Create a complete resume structure. Return ONLY valid JSON matching this TypeScript type:
{
  contact: { fullName: string, email: string, phone: string, location: string, linkedin: string, github: string, website: string },
  summary: string (2-3 compelling sentences),
  experience: Array<{
    id: string (use "exp1", "exp2" etc.),
    company: string,
    title: string,
    location: string,
    startDate: string (YYYY-MM format or ""),
    endDate: string (YYYY-MM format or ""),
    current: boolean,
    bullets: string[] (3-4 strong achievement bullets)
  }>,
  education: Array<{
    id: string (use "edu1", "edu2" etc.),
    school: string,
    degree: string,
    field: string,
    location: string,
    startDate: string,
    endDate: string,
    gpa: string
  }>,
  skills: {
    categories: Array<{ name: string, skills: string (comma-separated) }>
  },
  projects: [],
  sectionOrder: ["summary", "experience", "education", "skills", "projects"]
}

Extract all information from the rough notes. For anything not mentioned, use empty strings. Return ONLY JSON.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return NextResponse.json({ error: 'Parse error' }, { status: 500 })

  const content = JSON.parse(jsonMatch[0]) as ResumeContent

  // Ensure IDs are proper
  content.experience = (content.experience ?? []).map((e, i) => ({ ...e, id: e.id || generateId() }))
  content.education = (content.education ?? []).map((e, i) => ({ ...e, id: e.id || generateId() }))
  content.projects = (content.projects ?? []).map((p, i) => ({ ...p, id: p.id || generateId() }))

  await supabase.from('rb_ai_usage').insert({ user_id: user.id, action: 'onboard' })

  return NextResponse.json({ content })
}
