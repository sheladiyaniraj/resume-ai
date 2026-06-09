'use client'

import { useEffect, useState, useCallback } from 'react'
import { Resume, ResumeVersion, Subscription, TemplateId } from '@/types/resume'
import { useResumeStore } from '@/store/resumeStore'
import { createClient } from '@/lib/supabase/client'
import ResumeEditor from '@/components/resume/ResumeEditor'
import ResumePreview from '@/components/resume/ResumePreview'
import EditorToolbar from '@/components/resume/EditorToolbar'
import AIPanel from '@/components/resume/AIPanel'
import toast from 'react-hot-toast'

interface Props {
  resume: Resume
  subscription: Subscription | null
  versions: ResumeVersion[]
  userId: string
}

export default function ResumeEditorClient({ resume, subscription, versions, userId }: Props) {
  const {
    content, template, resumeName, isDirty,
    setContent, setTemplate, setResumeName, setResumeId, setIsSaving
  } = useResumeStore()

  const [showAIPanel, setShowAIPanel] = useState(false)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const supabase = createClient()
  const isPro = subscription?.plan === 'pro' && subscription?.status === 'active'

  useEffect(() => {
    setResumeId(resume.id)
    setContent(resume.content)
    setTemplate(resume.template as TemplateId)
    setResumeName(resume.name)
  }, [resume.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const save = useCallback(async () => {
    setIsSaving(true)
    const { error } = await supabase
      .from('rb_resumes')
      .update({ content, template, name: resumeName, updated_at: new Date().toISOString() })
      .eq('id', resume.id)
    setIsSaving(false)
    if (error) {
      toast.error('Failed to save')
    } else {
      toast.success('Saved')
    }
  }, [content, template, resumeName, resume.id, supabase, setIsSaving])

  // Auto-save every 30s when dirty
  useEffect(() => {
    if (!isDirty) return
    const t = setTimeout(save, 30000)
    return () => clearTimeout(t)
  }, [isDirty, save])

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
      <EditorToolbar
        resumeId={resume.id}
        isPro={isPro}
        onSave={save}
        onToggleAI={() => setShowAIPanel((v) => !v)}
        showAIPanel={showAIPanel}
        versions={versions}
        userId={userId}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Editor (always visible on desktop, tab-controlled on mobile) */}
        <div className={`${activeTab === 'edit' ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-[420px] lg:w-[480px] bg-white border-r border-slate-200 overflow-y-auto flex-shrink-0`}>
          <ResumeEditor />
        </div>

        {/* Center: Preview */}
        <div className={`${activeTab === 'preview' ? 'flex' : 'hidden'} md:flex flex-1 overflow-y-auto items-start justify-center p-6`}>
          <ResumePreview template={template} isPro={isPro} />
        </div>

        {/* Right: AI Panel */}
        {showAIPanel && (
          <div className="w-[380px] flex-shrink-0 bg-white border-l border-slate-200 overflow-y-auto">
            <AIPanel
              resumeId={resume.id}
              isPro={isPro}
              onClose={() => setShowAIPanel(false)}
              userId={userId}
            />
          </div>
        )}
      </div>
    </div>
  )
}
