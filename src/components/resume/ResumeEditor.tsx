'use client'

import { useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import { generateId } from '@/lib/utils'
import ContactSection from './sections/ContactSection'
import SummarySection from './sections/SummarySection'
import ExperienceSection from './sections/ExperienceSection'
import EducationSection from './sections/EducationSection'
import SkillsSection from './sections/SkillsSection'
import ProjectsSection from './sections/ProjectsSection'
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react'

const SECTION_LABELS: Record<string, string> = {
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
}

export default function ResumeEditor() {
  const { content, updateContent } = useResumeStore()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  function toggleSection(key: string) {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const sectionOrder = content.sectionOrder ?? ['summary', 'experience', 'education', 'skills', 'projects']

  function renderSection(key: string) {
    const isCollapsed = collapsed[key]
    return (
      <div key={key} className="border-b border-slate-100 last:border-0">
        <button
          onClick={() => toggleSection(key)}
          className="w-full flex items-center gap-2 px-5 py-3.5 text-left hover:bg-slate-50 transition-colors group"
        >
          <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
          <span className="flex-1 text-sm font-semibold text-slate-700">{SECTION_LABELS[key] ?? key}</span>
          {isCollapsed
            ? <ChevronRight className="w-4 h-4 text-slate-400" />
            : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {!isCollapsed && (
          <div className="px-5 pb-5">
            {key === 'summary' && <SummarySection />}
            {key === 'experience' && <ExperienceSection />}
            {key === 'education' && <EducationSection />}
            {key === 'skills' && <SkillsSection />}
            {key === 'projects' && <ProjectsSection />}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Contact always first */}
      <div className="border-b border-slate-100">
        <button
          onClick={() => toggleSection('contact')}
          className="w-full flex items-center gap-2 px-5 py-3.5 text-left hover:bg-slate-50 transition-colors"
        >
          <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
          <span className="flex-1 text-sm font-semibold text-slate-700">Contact Information</span>
          {collapsed['contact']
            ? <ChevronRight className="w-4 h-4 text-slate-400" />
            : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {!collapsed['contact'] && (
          <div className="px-5 pb-5">
            <ContactSection />
          </div>
        )}
      </div>
      {sectionOrder.map(renderSection)}
    </div>
  )
}
