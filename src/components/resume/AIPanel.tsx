'use client'

import { useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import { ATSFeedback } from '@/types/resume'
import { Sparkles, Target, X, Loader2, ChevronRight, Crown, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

interface Props {
  resumeId: string
  isPro: boolean
  onClose: () => void
  userId: string
}

type Tab = 'tailor' | 'ats' | 'onboard'

export default function AIPanel({ resumeId, isPro, onClose, userId }: Props) {
  const { content, setContent, jobDescription, setJobDescription } = useResumeStore()
  const [tab, setTab] = useState<Tab>('tailor')
  const [generating, setGenerating] = useState(false)
  const [scoring, setScoring] = useState(false)
  const [atsFeedback, setAtsFeedback] = useState<ATSFeedback | null>(null)
  const [roughExperience, setRoughExperience] = useState('')
  const [onboarding, setOnboarding] = useState(false)
  const supabase = createClient()

  async function tailorResume() {
    if (!jobDescription.trim()) { toast.error('Paste a job description first'); return }
    setGenerating(true)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, jobDescription }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setContent(data.content)
      // Save to DB
      await supabase.from('rb_resumes').update({ content: data.content, job_description: jobDescription }).eq('id', resumeId)
      toast.success('Resume tailored to the job description!')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Generation failed')
    }
    setGenerating(false)
  }

  async function getATSScore() {
    if (!isPro) { toast.error('ATS scoring is a Pro feature'); return }
    if (!jobDescription.trim()) { toast.error('Paste a job description first'); return }
    setScoring(true)
    try {
      const res = await fetch('/api/ai/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, jobDescription }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAtsFeedback(data.feedback)
      await supabase.from('rb_resumes').update({ ats_score: data.feedback.score, ats_feedback: data.feedback }).eq('id', resumeId)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Scoring failed')
    }
    setScoring(false)
  }

  async function onboardFromExperience() {
    if (!roughExperience.trim()) { toast.error('Describe your experience first'); return }
    setOnboarding(true)
    try {
      const res = await fetch('/api/ai/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roughExperience, jobDescription }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setContent(data.content)
      await supabase.from('rb_resumes').update({ content: data.content }).eq('id', resumeId)
      toast.success('Resume generated from your experience!')
      setTab('tailor')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to generate')
    }
    setOnboarding(false)
  }

  const scoreColor = atsFeedback
    ? atsFeedback.score >= 80 ? 'text-emerald-600' : atsFeedback.score >= 60 ? 'text-amber-600' : 'text-red-500'
    : ''

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <span className="font-semibold text-sm text-slate-900">AI Tools</span>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 px-4">
        {([
          { id: 'onboard', label: 'Quick Start' },
          { id: 'tailor', label: 'Tailor' },
          { id: 'ats', label: 'ATS Score', pro: true },
        ] as { id: Tab; label: string; pro?: boolean }[]).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`py-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1 ${tab === t.id ? 'border-violet-500 text-violet-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            {t.label}
            {t.pro && !isPro && <Crown className="w-3 h-3 text-amber-400" />}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Job Description (shared) */}
        {(tab === 'tailor' || tab === 'ats') && (
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={7}
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
            />
          </div>
        )}

        {/* TAILOR TAB */}
        {tab === 'tailor' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 leading-relaxed">
              AI will rewrite your summary and experience bullets to match the job description's keywords and tone.
            </p>
            <button
              onClick={tailorResume}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {generating ? 'Tailoring resume...' : 'Tailor to Job Description'}
            </button>
          </div>
        )}

        {/* ATS TAB */}
        {tab === 'ats' && (
          <div className="space-y-3">
            {!isPro ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                <Crown className="w-4 h-4 text-amber-500 mb-1" />
                ATS scoring requires a Pro plan.
              </div>
            ) : (
              <button
                onClick={getATSScore}
                disabled={scoring}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {scoring ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                {scoring ? 'Analyzing...' : 'Get ATS Score'}
              </button>
            )}

            {atsFeedback && (
              <div className="space-y-3">
                {/* Score */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                  <div className={`text-4xl font-bold ${scoreColor}`}>{atsFeedback.score}</div>
                  <div className="text-xs text-slate-500 mt-0.5">ATS Compatibility Score</div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-semibold text-slate-700">{atsFeedback.breakdown.keywordMatch}%</div>
                      <div className="text-slate-400">Keywords</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-slate-700">{atsFeedback.breakdown.formatting}%</div>
                      <div className="text-slate-400">Formatting</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-slate-700">{atsFeedback.breakdown.completeness}%</div>
                      <div className="text-slate-400">Completeness</div>
                    </div>
                  </div>
                </div>

                {/* Missing keywords */}
                {atsFeedback.missingKeywords.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-red-600 mb-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Missing keywords
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {atsFeedback.missingKeywords.map(k => (
                        <span key={k} className="text-xs bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-full">{k}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Present keywords */}
                {atsFeedback.presentKeywords.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-emerald-600 mb-1.5 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Present keywords
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {atsFeedback.presentKeywords.slice(0, 8).map(k => (
                        <span key={k} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">{k}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fixes */}
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-2">Recommended fixes</p>
                  <div className="space-y-2">
                    {atsFeedback.fixes.map((fix, i) => (
                      <div key={i} className="flex gap-2 text-xs text-slate-600 bg-slate-50 rounded-lg p-2.5">
                        <ChevronRight className="w-3.5 h-3.5 text-violet-500 flex-shrink-0 mt-0.5" />
                        <span>{fix}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ONBOARD TAB */}
        {tab === 'onboard' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 leading-relaxed">
              Paste your rough experience, old resume text, or LinkedIn bio. AI will structure it into a complete resume.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Your Experience (rough notes)</label>
              <textarea
                value={roughExperience}
                onChange={(e) => setRoughExperience(e.target.value)}
                placeholder="e.g. Worked at Google for 3 years as SWE, built search ranking systems, increased relevance by 15%. Before that did internships at startups. MIT CS grad 2020..."
                rows={8}
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Target Job (optional)</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description to tailor the output..."
                rows={4}
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
              />
            </div>
            <button
              onClick={onboardFromExperience}
              disabled={onboarding}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50"
            >
              {onboarding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {onboarding ? 'Generating resume...' : 'Generate Full Resume'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
