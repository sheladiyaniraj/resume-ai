'use client'

import { useResumeStore } from '@/store/resumeStore'
import { Plus, Trash2 } from 'lucide-react'

export default function SkillsSection() {
  const { content, updateContent } = useResumeStore()

  function updateCategory(idx: number, field: 'name' | 'skills', value: string) {
    updateContent((prev) => ({
      ...prev,
      skills: {
        categories: prev.skills.categories.map((c, i) =>
          i === idx ? { ...c, [field]: value } : c
        ),
      },
    }))
  }

  function addCategory() {
    updateContent((prev) => ({
      ...prev,
      skills: { categories: [...prev.skills.categories, { name: '', skills: '' }] },
    }))
  }

  function removeCategory(idx: number) {
    updateContent((prev) => ({
      ...prev,
      skills: { categories: prev.skills.categories.filter((_, i) => i !== idx) },
    }))
  }

  return (
    <div className="space-y-3">
      {content.skills.categories.map((cat, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              value={cat.name}
              onChange={(e) => updateCategory(i, 'name', e.target.value)}
              placeholder="e.g. Programming Languages"
              className="flex-1 text-sm font-medium border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
            />
            {content.skills.categories.length > 1 && (
              <button onClick={() => removeCategory(i)} className="p-1.5 text-slate-300 hover:text-red-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <input
            value={cat.skills}
            onChange={(e) => updateCategory(i, 'skills', e.target.value)}
            placeholder="Python, TypeScript, Go, Rust"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
          />
        </div>
      ))}
      <button onClick={addCategory} className="flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-800 font-medium">
        <Plus className="w-4 h-4" /> Add category
      </button>
    </div>
  )
}
