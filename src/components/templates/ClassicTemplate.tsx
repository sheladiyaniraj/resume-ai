import { ResumeContent } from '@/types/resume'
import { formatDate } from '@/lib/utils'

export default function ClassicTemplate({ content }: { content: ResumeContent }) {
  const { contact, summary, experience, education, skills, projects, sectionOrder } = content

  function renderSection(key: string) {
    switch (key) {
      case 'summary':
        if (!summary) return null
        return (
          <section key="summary" className="mb-5">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">Objective</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
          </section>
        )
      case 'experience':
        if (!experience?.some(e => e.company || e.title)) return null
        return (
          <section key="experience" className="mb-5">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Professional Experience</h2>
            <div className="space-y-4">
              {experience.map((exp) =>
                (exp.title || exp.company) ? (
                  <div key={exp.id}>
                    <div className="flex justify-between">
                      <span className="font-bold text-sm text-gray-900">{exp.title}</span>
                      <span className="text-xs text-gray-500">{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                    </div>
                    <div className="text-sm italic text-gray-600 mb-1">{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                    <ul className="space-y-0.5">
                      {exp.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="text-sm text-gray-700 flex gap-2">
                          <span className="flex-shrink-0">–</span>{b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null
              )}
            </div>
          </section>
        )
      case 'education':
        if (!education?.some(e => e.school || e.degree)) return null
        return (
          <section key="education" className="mb-5">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Education</h2>
            {education.map((edu) =>
              (edu.school || edu.degree) ? (
                <div key={edu.id} className="flex justify-between">
                  <div>
                    <div className="font-bold text-sm text-gray-900">{edu.school}</div>
                    <div className="text-sm italic text-gray-600">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                  </div>
                  <div className="text-xs text-gray-500">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</div>
                </div>
              ) : null
            )}
          </section>
        )
      case 'skills':
        if (!skills?.categories?.some(c => c.skills)) return null
        return (
          <section key="skills" className="mb-5">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">Skills</h2>
            {skills.categories.filter(c => c.skills).map((cat, i) => (
              <div key={i} className="text-sm text-gray-700">
                {cat.name ? <span className="font-semibold">{cat.name}: </span> : null}{cat.skills}
              </div>
            ))}
          </section>
        )
      case 'projects':
        if (!projects?.some(p => p.name)) return null
        return (
          <section key="projects" className="mb-5">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Projects</h2>
            {projects.filter(p => p.name).map((p) => (
              <div key={p.id} className="mb-3">
                <div className="font-bold text-sm text-gray-900">{p.name}{p.technologies ? ` (${p.technologies})` : ''}</div>
                {p.bullets.filter(Boolean).map((b, i) => <div key={i} className="text-sm text-gray-700">– {b}</div>)}
              </div>
            ))}
          </section>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-10" style={{ fontFamily: 'Times New Roman, serif' }}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{contact.fullName || 'Your Name'}</h1>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-0.5 mt-1 text-xs text-gray-600">
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
