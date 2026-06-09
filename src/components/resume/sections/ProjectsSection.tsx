'use client'

import { useResumeStore } from '@/store/resumeStore'
import { ProjectItem } from '@/types/resume'
import { generateId } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'

export default function ProjectsSection() {
  const { content, updateContent } = useResumeStore()

  function addProject() {
    updateContent((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: generateId(), name: '', description: '', technologies: '', url: '', bullets: [''] },
      ],
    }))
  }

  function removeProject(id: string) {
    updateContent((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }))
  }

  function updateProject(id: string, field: keyof ProjectItem, value: string | string[]) {
    updateContent((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }))
  }

  function updateBullet(projectId: string, idx: number, value: string) {
    updateContent((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projectId) return p
        const bullets = [...p.bullets]
        bullets[idx] = value
        return { ...p, bullets }
      }),
    }))
  }

  if (content.projects.length === 0) {
    return (
      <button onClick={addProject} className="flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-800 font-medium">
        <Plus className="w-4 h-4" /> Add project
      </button>
    )
  }

  return (
    <div className="space-y-4">
      {content.projects.map((project, i) => (
        <div key={project.id} className="border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Project {i + 1}</span>
            <button onClick={() => removeProject(project.id)} className="p-1 text-slate-300 hover:text-red-400">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'name', label: 'Project Name', placeholder: 'My App', span: 2 },
              { key: 'technologies', label: 'Technologies', placeholder: 'React, Node.js, PostgreSQL', span: 2 },
              { key: 'url', label: 'URL (optional)', placeholder: 'github.com/me/project', span: 2 },
            ].map(({ key, label, placeholder, span }) => (
              <div key={key} className={span === 2 ? 'col-span-2' : ''}>
                <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
                <input
                  value={(project as unknown as Record<string, string>)[key] ?? ''}
                  onChange={(e) => updateProject(project.id, key as keyof ProjectItem, e.target.value)}
                  placeholder={placeholder}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Description bullets</label>
            {project.bullets.map((bullet, bi) => (
              <div key={bi} className="flex gap-1.5 mb-1.5">
                <span className="text-slate-300 mt-2 text-sm">•</span>
                <input
                  value={bullet}
                  onChange={(e) => updateBullet(project.id, bi, e.target.value)}
                  placeholder="Built X that achieved Y..."
                  className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
            ))}
            <button
              onClick={() => updateProject(project.id, 'bullets', [...project.bullets, ''])}
              className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-medium"
            >
              <Plus className="w-3.5 h-3.5" /> Add bullet
            </button>
          </div>
        </div>
      ))}
      <button onClick={addProject} className="flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-800 font-medium">
        <Plus className="w-4 h-4" /> Add project
      </button>
    </div>
  )
}
