'use client'

import { useResumeStore } from '@/store/resumeStore'
import { ExperienceItem } from '@/types/resume'
import { generateId } from '@/lib/utils'
import { Plus, Trash2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import BulletRewriter from '../BulletRewriter'

export default function ExperienceSection() {
  const { content, updateContent } = useResumeStore()
  const [rewritingBullet, setRewritingBullet] = useState<{ expId: string; idx: number } | null>(null)

  function addExperience() {
    updateContent((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: generateId(),
          company: '',
          title: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          bullets: [''],
        },
      ],
    }))
  }

  function removeExperience(id: string) {
    updateContent((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }))
  }

  function updateExp(id: string, field: keyof ExperienceItem, value: string | boolean | string[]) {
    updateContent((prev) => ({
      ...prev,
      experience: prev.experience.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    }))
  }

  function updateBullet(expId: string, idx: number, value: string) {
    updateContent((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => {
        if (e.id !== expId) return e
        const bullets = [...e.bullets]
        bullets[idx] = value
        return { ...e, bullets }
      }),
    }))
  }

  function addBullet(expId: string) {
    updateContent((prev) => ({
      ...prev,
      experience: prev.experience.map((e) =>
        e.id === expId ? { ...e, bullets: [...e.bullets, ''] } : e
      ),
    }))
  }

  function removeBullet(expId: string, idx: number) {
    updateContent((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => {
        if (e.id !== expId) return e
        const bullets = e.bullets.filter((_, i) => i !== idx)
        return { ...e, bullets: bullets.length ? bullets : [''] }
      }),
    }))
  }

  function applyRewrite(text: string) {
    if (!rewritingBullet) return
    updateBullet(rewritingBullet.expId, rewritingBullet.idx, text)
    setRewritingBullet(null)
  }

  return (
    <div className="space-y-5">
      {content.experience.map((exp, i) => (
        <div key={exp.id} className="border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Position {i + 1}</span>
            {content.experience.length > 1 && (
              <button onClick={() => removeExperience(exp.id)} className="p-1 text-slate-300 hover:text-red-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Job Title" value={exp.title} onChange={(v) => updateExp(exp.id, 'title', v)} placeholder="Software Engineer" />
            <Field label="Company" value={exp.company} onChange={(v) => updateExp(exp.id, 'company', v)} placeholder="Acme Corp" />
            <Field label="Location" value={exp.location} onChange={(v) => updateExp(exp.id, 'location', v)} placeholder="San Francisco, CA" />
            <div />
            <Field label="Start Date" value={exp.startDate} onChange={(v) => updateExp(exp.id, 'startDate', v)} placeholder="2021-06" type="month" />
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-500">End Date</label>
                <label className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updateExp(exp.id, 'current', e.target.checked)}
                    className="rounded"
                  />
                  Current
                </label>
              </div>
              {!exp.current && (
                <input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExp(exp.id, 'endDate', e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1A6FE8] focus:border-transparent"
                />
              )}
            </div>
          </div>

          {/* Bullets */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-2 block">Bullet Points</label>
            <div className="space-y-2">
              {exp.bullets.map((bullet, bi) => (
                <div key={bi} className="flex gap-1.5">
                  <span className="text-slate-300 mt-2 text-sm">•</span>
                  <textarea
                    value={bullet}
                    onChange={(e) => updateBullet(exp.id, bi, e.target.value)}
                    placeholder="Led development of a feature that increased revenue by 20%..."
                    rows={2}
                    className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1A6FE8] resize-none"
                  />
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => setRewritingBullet({ expId: exp.id, idx: bi })}
                      className="p-1.5 text-[#1A6FE8] hover:text-[#1A6FE8] hover:bg-[#EFF6FF] rounded-lg transition-colors"
                      title="AI rewrite"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                    {exp.bullets.length > 1 && (
                      <button
                        onClick={() => removeBullet(exp.id, bi)}
                        className="p-1.5 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => addBullet(exp.id)}
              className="mt-2 flex items-center gap-1 text-xs text-[#1A6FE8] hover:text-[#1459BF] font-medium"
            >
              <Plus className="w-3.5 h-3.5" /> Add bullet
            </button>
          </div>

          {rewritingBullet?.expId === exp.id && (
            <BulletRewriter
              bullet={exp.bullets[rewritingBullet.idx]}
              onApply={applyRewrite}
              onClose={() => setRewritingBullet(null)}
            />
          )}
        </div>
      ))}

      <button
        onClick={addExperience}
        className="flex items-center gap-1.5 text-sm text-[#1A6FE8] hover:text-[#1459BF] font-medium"
      >
        <Plus className="w-4 h-4" /> Add position
      </button>
    </div>
  )
}

function Field({
  label, value, onChange, placeholder, type = 'text'
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1A6FE8] focus:border-transparent"
      />
    </div>
  )
}
