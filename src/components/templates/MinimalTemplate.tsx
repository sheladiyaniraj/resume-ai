import { ResumeContent } from '@/types/resume'
import { formatDate } from '@/lib/utils'

export default function MinimalTemplate({ content }: { content: ResumeContent }) {
  const { contact, summary, experience, education, skills, projects, sectionOrder } = content

  function renderSection(key: string) {
    switch (key) {
      case 'summary':
        if (!summary) return null
        return (
          <section key="summary" className="mb-6">
            <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>
          </section>
        )
      case 'experience':
        if (!experience?.some(e => e.company || e.title)) return null
        return (
          <section key="experience" className="mb-6">
            <SectionHeader title="Experience" />
            {experience.map((exp) =>
              (exp.title || exp.company) ? (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-gray-900">{exp.title} · {exp.company}</span>
                    <span className="text-xs text-gray-400">{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                  </div>
                  {exp.location && <div className="text-xs text-gray-400 mb-1">{exp.location}</div>}
                  <ul className="space-y-1">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="text-sm text-gray-600 pl-3 relative before:absolute before:left-0 before:content-['·'] before:text-gray-400">{b}</li>
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
                <div key={edu.id} className="flex justify-between items-baseline mb-2">
                  <div>
                    <span className="text-sm font-semibold text-gray-900">{edu.school}</span>
                    <span className="text-sm text-gray-500"> · {edu.degree}{edu.field ? ` ${edu.field}` : ''}</span>
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(edu.endDate)}</span>
                </div>
              ) : null
            )}
          </section>
        )
      case 'skills':
        if (!skills?.categories?.some(c => c.skills)) return null
        return (
          <section key="skills" className="mb-6">
            <SectionHeader title="Skills" />
            <div className="flex flex-wrap gap-1.5">
              {skills.categories.filter(c => c.skills).flatMap(c =>
                c.skills.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                  <span key={`${c.name}-${i}`} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{s}</span>
                ))
              )}
            </div>
          </section>
        )
      case 'projects':
        if (!projects?.some(p => p.name)) return null
        return (
          <section key="projects" className="mb-6">
            <SectionHeader title="Projects" />
            {projects.filter(p => p.name).map((p) => (
              <div key={p.id} className="mb-3">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-gray-900">{p.name}</span>
                  {p.technologies && <span className="text-xs text-gray-400">{p.technologies}</span>}
                </div>
                {p.bullets.filter(Boolean).map((b, i) => (
                  <div key={i} className="text-sm text-gray-600 pl-3 relative before:absolute before:left-0 before:content-['·'] before:text-gray-400">{b}</div>
                ))}
              </div>
            ))}
          </section>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-10" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">{contact.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-gray-400">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
          {contact.github && <span>{contact.github}</span>}
        </div>
      </div>
      {(sectionOrder ?? ['summary', 'experience', 'education', 'skills', 'projects']).map(renderSection)}
    </div>
  )
}

function SectionHeader({ title }: { title: string }) {
  return <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">{title}</h2>
}
