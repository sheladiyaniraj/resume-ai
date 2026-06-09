'use client'

import { useResumeStore } from '@/store/resumeStore'

export default function SummarySection() {
  const { content, updateContent } = useResumeStore()

  return (
    <div>
      <textarea
        value={content.summary}
        onChange={(e) =>
          updateContent((prev) => ({ ...prev, summary: e.target.value }))
        }
        placeholder="Results-driven software engineer with 5+ years building scalable web applications..."
        rows={4}
        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-colors resize-none"
      />
      <p className="text-xs text-slate-400 mt-1">{content.summary.length} characters</p>
    </div>
  )
}
