'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { Resume, Subscription } from '@/types/resume'
import { createClient } from '@/lib/supabase/client'
import { getDefaultResumeContent } from '@/lib/defaults'
import { Sparkles, Plus, FileText, Trash2, Edit3, Clock, Crown, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface Props {
  user: User
  initialResumes: Resume[]
  subscription: Subscription | null
}

export default function DashboardClient({ user, initialResumes, subscription }: Props) {
  const [resumes, setResumes] = useState<Resume[]>(initialResumes)
  const [creating, setCreating] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const isPro = subscription?.plan === 'pro' && subscription?.status === 'active'

  async function createResume() {
    if (!isPro && resumes.length >= 1) {
      toast.error('Free plan is limited to 1 resume. Upgrade to Pro for unlimited.')
      return
    }
    setCreating(true)
    const { data, error } = await supabase
      .from('rb_resumes')
      .insert({
        user_id: user.id,
        name: 'Untitled Resume',
        template: 'modern',
        content: getDefaultResumeContent(),
      })
      .select()
      .single()

    setCreating(false)
    if (error) {
      toast.error('Failed to create resume')
      return
    }
    router.push(`/resume/${data.id}`)
  }

  async function deleteResume(id: string, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this resume?')) return
    const { error } = await supabase.from('rb_resumes').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete resume')
      return
    }
    setResumes((prev) => prev.filter((r) => r.id !== id))
    toast.success('Resume deleted')
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            <span className="font-semibold text-slate-900">ResumeAI</span>
          </div>
          <div className="flex items-center gap-3">
            {isPro ? (
              <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                <Crown className="w-3 h-3" /> Pro
              </span>
            ) : (
              <Link href="/upgrade" className="text-xs text-violet-600 font-medium hover:underline">
                Upgrade to Pro
              </Link>
            )}
            <button
              onClick={signOut}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Resumes</h1>
            <p className="text-sm text-slate-500 mt-1">
              {user.email} · {isPro ? 'Pro plan' : 'Free plan'}
            </p>
          </div>
          <button
            onClick={createResume}
            disabled={creating}
            className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {creating ? 'Creating...' : 'New Resume'}
          </button>
        </div>

        {resumes.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
            <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-7 h-7 text-violet-500" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">No resumes yet</h2>
            <p className="text-sm text-slate-500 mb-6">Create your first AI-tailored resume</p>
            <button
              onClick={createResume}
              disabled={creating}
              className="inline-flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Create Resume
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume) => (
              <Link
                key={resume.id}
                href={`/resume/${resume.id}`}
                className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-violet-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-violet-500" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => deleteResume(resume.id, e)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="p-1.5 text-slate-400 hover:text-violet-500 hover:bg-violet-50 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1 truncate">{resume.name}</h3>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  {new Date(resume.updated_at).toLocaleDateString()}
                </div>
                {resume.ats_score !== undefined && resume.ats_score !== null && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{ width: `${resume.ats_score}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600">{resume.ats_score} ATS</span>
                  </div>
                )}
              </Link>
            ))}
            {/* Create new card */}
            <button
              onClick={createResume}
              disabled={creating}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 hover:border-violet-300 hover:bg-violet-50 transition-all text-slate-400 hover:text-violet-500 disabled:opacity-50"
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm font-medium">New Resume</span>
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
