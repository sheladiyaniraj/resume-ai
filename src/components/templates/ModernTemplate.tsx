import { ResumeContent } from '@/types/resume'
import { formatDate } from '@/lib/utils'

export default function ModernTemplate({ content }: { content: ResumeContent }) {
  const { contact, summary, experience, education, skills, projects, sectionOrder } = content

  function renderSection(key: string) {
    switch (key) {
      case 'summary':
        if (!summary) return null
        return (
          <section key="summary" className="mb-5">
            <SectionHeader title="Summary" color="#7c3aed" />
            <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
          </section>
        )
      case 'experience':
        if (!experience?.some(e => e.company || e.title)) return null
        return (
          <section key="experience" className="mb-5">
            <SectionHeader title="Experience" color="#7c3aed" />
            <div className="space-y-4">
              {experience.map((exp) => (
                (exp.title || exp.company) ? (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{exp.title}</div>
                        <div className="text-sm text-gray-600">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                        {formatDate(exp.startDate)}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : formatDate(exp.endDate)}
                      </div>
                    </div>
                    {exp.bullets.filter(Boolean).length > 0 && (
                      <ul className="mt-1.5 space-y-0.5">
                        {exp.bullets.filter(Boolean).map((b, i) => (
                          <li key={i} className="flex gap-2 text-sm text-gray-700">
                            <span className="mt-0.5 text-violet-500 flex-shrink-0">•</span>
                            <span className="leading-relaxed">{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : null
              ))}
            </div>
          </section>
        )
      case 'education':
        if (!education?.some(e => e.school || e.degree)) return null
        return (
          <section key="education" className="mb-5">
            <SectionHeader title="Education" color="#7c3aed" />
            <div className="space-y-3">
              {education.map((edu) => (
                (edu.school || edu.degree) ? (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-sm text-gray-900">{edu.school}</div>
                      <div className="text-sm text-gray-600">
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {formatDate(edu.startDate)}{edu.startDate ? ' – ' : ''}{formatDate(edu.endDate)}
                    </div>
                  </div>
                ) : null
              ))}
            </div>
          </section>
        )
      case 'skills':
        if (!skills?.categories?.some(c => c.skills)) return null
        return (
          <section key="skills" className="mb-5">
            <SectionHeader title="Skills" color="#7c3aed" />
            <div className="space-y-1.5">
              {skills.categories.filter(c => c.skills).map((cat, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  {cat.name && <span className="font-semibold text-gray-700 whitespace-nowrap">{cat.name}:</span>}
                  <span className="text-gray-600">{cat.skills}</span>
                </div>
              ))}
            </div>
          </section>
        )
      case 'projects':
        if (!projects?.some(p => p.name)) return null
        return (
          <section key="projects" className="mb-5">
            <SectionHeader title="Projects" color="#7c3aed" />
            <div className="space-y-3">
              {projects.filter(p => p.name).map((p) => (
                <div key={p.id}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-sm text-gray-900">{p.name}</span>
                    {p.technologies && <span className="text-xs text-gray-500">· {p.technologies}</span>}
                    {p.url && <span className="text-xs text-violet-600 ml-auto">{p.url}</span>}
                  </div>
                  {p.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700 mt-0.5">
                      <span className="mt-0.5 text-violet-500">•</span>{b}
                    </li>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-10 font-sans" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div className="mb-6 border-b-2 border-violet-600 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {contact.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-xs text-gray-500">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
          {contact.github && <span>{contact.github}</span>}
          {contact.website && <span>{contact.website}</span>}
        </div>
      </div>

      {(sectionOrder ?? ['summary', 'experience', 'education', 'skills', 'projects']).map(renderSection)}
    </div>
  )
}

function SectionHeader({ title, color }: { title: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{title}</h2>
      <div className="flex-1 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
    </div>
  )
}
