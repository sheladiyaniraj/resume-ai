import { create } from 'zustand'
import { ResumeContent, TemplateId } from '@/types/resume'
import { getDefaultResumeContent } from '@/lib/defaults'

interface ResumeStore {
  resumeId: string | null
  resumeName: string
  template: TemplateId
  content: ResumeContent
  isDirty: boolean
  isSaving: boolean
  jobDescription: string

  setResumeId: (id: string) => void
  setResumeName: (name: string) => void
  setTemplate: (template: TemplateId) => void
  setContent: (content: ResumeContent) => void
  updateContent: (updater: (prev: ResumeContent) => ResumeContent) => void
  setIsSaving: (saving: boolean) => void
  setJobDescription: (jd: string) => void
  reset: () => void
}

export const useResumeStore = create<ResumeStore>((set) => ({
  resumeId: null,
  resumeName: 'Untitled Resume',
  template: 'modern',
  content: getDefaultResumeContent(),
  isDirty: false,
  isSaving: false,
  jobDescription: '',

  setResumeId: (id) => set({ resumeId: id }),
  setResumeName: (name) => set({ resumeName: name, isDirty: true }),
  setTemplate: (template) => set({ template, isDirty: true }),
  setContent: (content) => set({ content, isDirty: true }),
  updateContent: (updater) =>
    set((state) => ({ content: updater(state.content), isDirty: true })),
  setIsSaving: (isSaving) => set({ isSaving }),
  setJobDescription: (jobDescription) => set({ jobDescription }),
  reset: () =>
    set({
      resumeId: null,
      resumeName: 'Untitled Resume',
      template: 'modern',
      content: getDefaultResumeContent(),
      isDirty: false,
      isSaving: false,
      jobDescription: '',
    }),
}))
