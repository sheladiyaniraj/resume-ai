import { ResumeContent } from '@/types/resume'
import { generateId } from './utils'

export function getDefaultResumeContent(): ResumeContent {
  return {
    contact: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: '',
    },
    summary: '',
    experience: [
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
    education: [
      {
        id: generateId(),
        school: '',
        degree: '',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: '',
        highlights: [],
      },
    ],
    skills: {
      categories: [
        { name: 'Technical Skills', skills: '' },
        { name: 'Tools & Technologies', skills: '' },
      ],
    },
    projects: [],
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects'],
  }
}
