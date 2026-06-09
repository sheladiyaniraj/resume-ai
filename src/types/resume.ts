export interface ContactInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin?: string
  github?: string
  website?: string
}

export interface ExperienceItem {
  id: string
  company: string
  title: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
}

export interface EducationItem {
  id: string
  school: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate: string
  gpa?: string
  highlights?: string[]
}

export interface ProjectItem {
  id: string
  name: string
  description: string
  technologies: string
  url?: string
  bullets: string[]
}

export interface SkillsSection {
  categories: { name: string; skills: string }[]
}

export interface ResumeContent {
  contact: ContactInfo
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: SkillsSection
  projects: ProjectItem[]
  sectionOrder: string[]
}

export interface Resume {
  id: string
  user_id: string
  name: string
  template: TemplateId
  content: ResumeContent
  job_description?: string
  ats_score?: number
  ats_feedback?: ATSFeedback
  created_at: string
  updated_at: string
}

export interface ResumeVersion {
  id: string
  resume_id: string
  user_id: string
  name: string
  content: ResumeContent
  created_at: string
}

export type TemplateId = 'modern' | 'classic' | 'minimal' | 'executive'

export interface ATSFeedback {
  score: number
  missingKeywords: string[]
  presentKeywords: string[]
  fixes: string[]
  breakdown: {
    keywordMatch: number
    formatting: number
    completeness: number
  }
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  plan: 'free' | 'pro'
  status: 'active' | 'canceled' | 'past_due'
  current_period_end?: string
  cancel_at_period_end: boolean
}
