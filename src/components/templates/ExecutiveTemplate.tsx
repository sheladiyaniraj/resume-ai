import { ResumeContent } from '@/types/resume'
import { formatDate } from '@/lib/utils'

export default function ExecutiveTemplate({ content }: { content: ResumeContent }) {
  const { contact, summary, experience, education, skills, projects, sectionOrder } = content

  function renderSection(key: string) {
    switch (key) {
      case 'summary':
        if (!summary) return null
        return (
          <section key="summary" className="mb-6">
            <SectionHeader title="Executive Summary" />
            <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
          </section>
        )
      case 'experience':
        if (!experience?.some(e => e.company || e.title)) return null
        return (
          <section key="experience" className="mb-6">
            <SectionHeader title="Professional Experience" />
            {experience.map((exp) =>
              (exp.title || exp.company) ? (
                <div key={exp.id} className="mb-5">
                  <div className="flex justify-between items-start border-l-2 border-gray-800 pl-3">
                    <div>
                      <div className="font-bold text-sm text-gray-900 uppercase tracking-wide">{exp.title}</div>
                      <div className="font-semibold text-sm text-gray-700">{exp.company}{exp.location ? ` | ${exp.location}` : ''}</div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="text-sm text-gray-700 flex gap-2 pl-3">
                        <span className="flex-shrink-0 font-bold text-gray-400">›</span>{b}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null
            )}
          </section>
        )
      case 'education':
        if (!education?.some(e => e.school || e.degree)) return null
        return (
          <section key="education" className="mb-6">
            <SectionHeader title="Education" />
            {education.map((edu) =>
              (edu.school || edu.degree) ? (
                <div key={edu.id} className="flex justify-between mb-2">
                  <div>
                    <div className="font-bold text-sm text-gray-900">{edu.school}</div>
                    <div className="text-sm text-gray-600">{edu.degree}{edu.field ? `, ${edu.field}` : ''}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</div>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                </div>
              ) : null
            )}
          </section>
        )
      case 'skills':
        if (!skills?.categories?.some(c => c.skills)) return null
        return (
          <section key="skills" className="mb-6">
            <SectionHeader title="Core Competencies" />
            <div className="grid grid-cols-2 gap-x-8 gap-y-1">
              {skills.categories.filter(c => c.skills).map((cat, i) => (
                <div key={i} className="text-sm text-gray-700">
                  {cat.name ? <span className="font-semibold text-gray-800">{cat.name}: </span> : null}{cat.skills}
                </div>
              ))}
            </div>
          </section>
        )
      case 'projects':
        if (!projects?.some(p => p.name)) return null
        return (
          <section key="projects" className="mb-6">
            <SectionHeader title="Key Projects" />
            {projects.filter(p => p.name).map((p) => (
              <div key={p.id} className="mb-3 border-l-2 border-gray-300 pl-3">
                <div className="font-bold text-sm text-gray-900">{p.name}{p.technologies ? ` · ${p.technologies}` : ''}</div>
                {p.bullets.filter(Boolean).map((b, i) => <div key={i} className="text-sm text-gray-700">› {b}</div>)}
              </div>
            ))}
          </section>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-10" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Executive header with accent bar */}
      <div className="mb-6">
        <div className="h-1 bg-gray-900 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight uppercase">{contact.fullName || 'Your Name'}</h1>
        <div className="h-0.5 bg-gray-300 mt-2 mb-2" />
        <div className="flex flex-wrap gap-x-5 gap-y-0.5 text-xs text-gray-600 font-medium">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
        </div>
      </div>
      {(sectionOrder ?? ['summary', 'experience', 'education', 'skills', 'projects']).map(renderSection)}
    </div>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest">{title}</h2>
      <div className="h-0.5 bg-gray-200 mt-1" />
    </div>
  )
}
