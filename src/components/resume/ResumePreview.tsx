'use client'

import { useResumeStore } from '@/store/resumeStore'
import { TemplateId } from '@/types/resume'
import ModernTemplate from '@/components/templates/ModernTemplate'
import ClassicTemplate from '@/components/templates/ClassicTemplate'
import MinimalTemplate from '@/components/templates/MinimalTemplate'
import ExecutiveTemplate from '@/components/templates/ExecutiveTemplate'

interface Props {
  template: TemplateId
  isPro: boolean
}

export default function ResumePreview({ template, isPro }: Props) {
  const { content } = useResumeStore()

  const templates = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    minimal: MinimalTemplate,
    executive: ExecutiveTemplate,
  }

  const Template = templates[template] ?? ModernTemplate

  return (
    <div className="relative">
      {/* A4 paper shadow */}
      <div
        id="resume-preview"
        className="bg-white shadow-xl"
        style={{ width: '210mm', minHeight: '297mm' }}
      >
        <Template content={content} />
      </div>

      {/* Watermark for free users */}
      {!isPro && (
        <div className="absolute bottom-8 right-8 pointer-events-none">
          <div className="bg-slate-100 text-slate-400 text-xs px-2 py-1 rounded font-medium">
            ResumeAI Free
          </div>
        </div>
      )}
    </div>
  )
}
