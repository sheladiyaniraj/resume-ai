'use client'

import { useResumeStore } from '@/store/resumeStore'
import { EducationItem } from '@/types/resume'
import { generateId } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'

export default function EducationSection() {
  const { content, updateContent } = useResumeStore()

  function addEducation() {
    updateContent((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: generateId(), school: '', degree: '', field: '', location: '', startDate: '', endDate: '', gpa: '' },
      ],
    }))
  }

  function removeEducation(id: string) {
    updateContent((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }))
  }

  function updateEdu(id: string, field: keyof EducationItem, value: string) {
    updateContent((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }))
  }

  return (
    <div className="space-y-4">
      {content.education.map((edu, i) => (
        <div key={edu.id} className="border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Education {i + 1}</span>
            {content.education.length > 1 && (
              <button onClick={() => removeEducation(edu.id)} className="p-1 text-slate-300 hover:text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'school', label: 'School', placeholder: 'MIT', span: 2 },
              { key: 'degree', label: 'Degree', placeholder: "Bachelor's" },
              { key: 'field', label: 'Field of Study', placeholder: 'Computer Science' },
              { key: 'location', label: 'Location', placeholder: 'Cambridge, MA' },
              { key: 'gpa', label: 'GPA (optional)', placeholder: '3.8' },
              { key: 'startDate', label: 'Start', placeholder: '2018-09', type: 'month' },
              { key: 'endDate', label: 'End', placeholder: '2022-05', type: 'month' },
            ].map(({ key, label, placeholder, span, type }) => (
              <div key={key} className={span === 2 ? 'col-span-2' : ''}>
                <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
                <input
                  type={type ?? 'text'}
                  value={(edu as unknown as Record<string, string>)[key] ?? ''}
                  onChange={(e) => updateEdu(edu.id, key as keyof EducationItem, e.target.value)}
                  placeholder={placeholder}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={addEducation} className="flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-800 font-medium">
        <Plus className="w-4 h-4" /> Add education
      </button>
    </div>
  )
}
