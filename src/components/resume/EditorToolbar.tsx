'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useResumeStore } from '@/store/resumeStore'
import { ResumeVersion, TemplateId } from '@/types/resume'
import { createClient } from '@/lib/supabase/client'
import {
  Sparkles, ChevronLeft, Save, Download, History, Palette,
  Loader2, Crown, Eye, Edit3, X, Check
} from 'lucide-react'
import toast from 'react-hot-toast'
import { generatePDF } from '@/lib/pdf'

const TEMPLATES: { id: TemplateId; label: string }[] = [
  { id: 'modern', label: 'Modern' },
  { id: 'classic', label: 'Classic' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'executive', label: 'Executive' },
]

interface Props {
  resumeId: string
  isPro: boolean
  onSave: () => void
  onToggleAI: () => void
  showAIPanel: boolean
  versions: ResumeVersion[]
  userId: string
  activeTab: 'edit' | 'preview'
  setActiveTab: (tab: 'edit' | 'preview') => void
}

export default function EditorToolbar({
  resumeId, isPro, onSave, onToggleAI, showAIPanel, versions, userId, activeTab, setActiveTab
}: Props) {
  const { resumeName, setResumeName, template, setTemplate, content, isSaving, isDirty } = useResumeStore()
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(resumeName)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showVersions, setShowVersions] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [savingVersion, setSavingVersion] = useState(false)
  const supabase = createClient()

  function saveName() {
    if (nameInput.trim()) setResumeName(nameInput.trim())
    setEditingName(false)
  }

  async function handleExport() {
    setExporting(true)
    try {
      await generatePDF(content, template, resumeName, isPro)
    } catch {
      toast.error('Export failed')
    }
    setExporting(false)
  }

  async function saveVersion() {
    setSavingVersion(true)
    const name = prompt('Version name:', `Version ${versions.length + 1}`)
    if (!name) { setSavingVersion(false); return }
    const { error } = await supabase.from('rb_versions').insert({
      resume_id: resumeId,
      user_id: userId,
      name,
      content,
    })
    setSavingVersion(false)
    if (error) toast.error('Failed to save version')
    else toast.success(`Saved "${name}"`)
  }

  async function restoreVersion(v: ResumeVersion) {
    if (!confirm(`Restore "${v.name}"? Current content will be overwritten.`)) return
    const { updateContent } = useResumeStore.getState()
    updateContent(() => v.content)
    setShowVersions(false)
    toast.success(`Restored "${v.name}"`)
  }

  return (
    <header className="bg-white border-b border-slate-200 h-14 flex items-center px-4 gap-3 flex-shrink-0 z-10">
      {/* Back */}
      <Link href="/dashboard" className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100">
        <ChevronLeft className="w-4 h-4" />
      </Link>

      {/* Resume Name */}
      {editingName ? (
        <div className="flex items-center gap-1">
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false) }}
            className="text-sm font-medium text-slate-900 border border-violet-300 rounded px-2 py-0.5 w-40 focus:outline-none"
            autoFocus
          />
          <button onClick={saveName} className="p-1 text-emerald-500 hover:text-emerald-600">
            <Check className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setEditingName(false)} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => { setNameInput(resumeName); setEditingName(true) }}
          className="text-sm font-medium text-slate-900 hover:text-violet-600 transition-colors max-w-[160px] truncate"
        >
          {resumeName}
        </button>
      )}

      {isDirty && !isSaving && <span className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" />}

      {/* Mobile tabs */}
      <div className="flex md:hidden items-center gap-1 ml-2 bg-slate-100 rounded-lg p-0.5">
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'edit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
        >
          <Edit3 className="w-3 h-3" /> Edit
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
        >
          <Eye className="w-3 h-3" /> Preview
        </button>
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* Templates */}
        <div className="relative">
          <button
            onClick={() => setShowTemplates((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors"
          >
            <Palette className="w-3.5 h-3.5" /> Template
          </button>
          {showTemplates && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-20 min-w-[140px]">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTemplate(t.id); setShowTemplates(false) }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${template === t.id ? 'bg-violet-50 text-violet-700' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  {t.label}
                  {template === t.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Versions */}
        {isPro && (
          <div className="relative">
            <button
              onClick={saveVersion}
              disabled={savingVersion}
              className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Version</span>
            </button>
            {versions.length > 0 && (
              <button
                onClick={() => setShowVersions((v) => !v)}
                className="ml-0.5 px-1 py-1.5 text-slate-400 hover:text-slate-600 text-xs"
              >▾</button>
            )}
            {showVersions && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-20 min-w-[200px]">
                {versions.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => restoreVersion(v)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                  >
                    <div className="font-medium">{v.name}</div>
                    <div className="text-xs text-slate-400">{new Date(v.created_at).toLocaleDateString()}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI */}
        <button
          onClick={onToggleAI}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${showAIPanel ? 'bg-violet-600 text-white' : 'text-violet-700 bg-violet-50 hover:bg-violet-100'}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Tools</span>
        </button>

        {/* Export */}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors"
        >
          {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Export</span>
          {!isPro && <span className="hidden sm:inline text-slate-400">(free)</span>}
        </button>

        {/* Save */}
        <button
          onClick={onSave}
          disabled={isSaving || !isDirty}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors disabled:opacity-40"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save
        </button>
      </div>
    </header>
  )
}
