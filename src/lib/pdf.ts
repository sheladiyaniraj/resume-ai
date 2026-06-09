import { ResumeContent, TemplateId } from '@/types/resume'
import { formatDate } from './utils'

export async function generatePDF(
  content: ResumeContent,
  template: TemplateId,
  name: string,
  isPro: boolean
): Promise<void> {
  // Build HTML for the resume
  const html = buildResumeHTML(content, template, name, isPro)

  // Use print dialog via a hidden iframe
  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  document.body.appendChild(iframe)

  const doc = iframe.contentWindow?.document
  if (!doc) return

  doc.open()
  doc.write(html)
  doc.close()

  // Wait for fonts/styles to load then print
  await new Promise<void>((resolve) => {
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.print()
        setTimeout(() => {
          document.body.removeChild(iframe)
          resolve()
        }, 1000)
      }, 500)
    }
  })
}

function buildResumeHTML(
  content: ResumeContent,
  template: TemplateId,
  name: string,
  isPro: boolean
): string {
  const { contact, summary, experience, education, skills, projects, sectionOrder } = content
  const order = sectionOrder ?? ['summary', 'experience', 'education', 'skills', 'projects']

  const styles = getTemplateStyles(template)

  function section(key: string): string {
    switch (key) {
      case 'summary':
        if (!summary) return ''
        return `<section class="section"><h2 class="section-title">Summary</h2><p class="body">${esc(summary)}</p></section>`
      case 'experience':
        if (!experience?.some(e => e.company || e.title)) return ''
        return `<section class="section"><h2 class="section-title">Experience</h2>${experience
          .filter(e => e.title || e.company)
          .map(e => `
            <div class="entry">
              <div class="entry-header">
                <div><strong>${esc(e.title)}</strong> · ${esc(e.company)}${e.location ? ` · ${esc(e.location)}` : ''}</div>
                <span class="date">${formatDate(e.startDate)} – ${e.current ? 'Present' : formatDate(e.endDate)}</span>
              </div>
              <ul>${e.bullets.filter(Boolean).map(b => `<li>${esc(b)}</li>`).join('')}</ul>
            </div>`).join('')}</section>`
      case 'education':
        if (!education?.some(e => e.school || e.degree)) return ''
        return `<section class="section"><h2 class="section-title">Education</h2>${education
          .filter(e => e.school || e.degree)
          .map(e => `
            <div class="entry">
              <div class="entry-header">
                <div><strong>${esc(e.school)}</strong> · ${esc(e.degree)}${e.field ? ` in ${esc(e.field)}` : ''}${e.gpa ? ` · GPA ${esc(e.gpa)}` : ''}</div>
                <span class="date">${formatDate(e.startDate)} – ${formatDate(e.endDate)}</span>
              </div>
            </div>`).join('')}</section>`
      case 'skills':
        if (!skills?.categories?.some(c => c.skills)) return ''
        return `<section class="section"><h2 class="section-title">Skills</h2>${skills.categories.filter(c => c.skills)
          .map(c => `<div class="body"><strong>${esc(c.name)}:</strong> ${esc(c.skills)}</div>`).join('')}</section>`
      case 'projects':
        if (!projects?.some(p => p.name)) return ''
        return `<section class="section"><h2 class="section-title">Projects</h2>${projects.filter(p => p.name)
          .map(p => `
            <div class="entry">
              <strong>${esc(p.name)}</strong>${p.technologies ? ` · ${esc(p.technologies)}` : ''}
              <ul>${p.bullets.filter(Boolean).map(b => `<li>${esc(b)}</li>`).join('')}</ul>
            </div>`).join('')}</section>`
      default:
        return ''
    }
  }

  const watermark = !isPro
    ? `<div style="position:fixed;bottom:24px;right:24px;font-size:10px;color:#94a3b8;font-family:sans-serif">Created with ResumeAI (free)</div>`
    : ''

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${esc(name)}</title>
<style>
${styles}
@media print {
  @page { margin: 15mm; size: A4; }
  body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
}
</style>
</head>
<body>
<div class="header">
  <h1 class="name">${esc(contact.fullName || 'Your Name')}</h1>
  <div class="contact-line">
    ${[contact.email, contact.phone, contact.location, contact.linkedin, contact.github, contact.website]
      .filter(Boolean).map(c => `<span>${esc(c!)}</span>`).join('<span class="sep">·</span>')}
  </div>
</div>
${order.map(section).join('')}
${watermark}
</body></html>`
}

function getTemplateStyles(template: TemplateId): string {
  const base = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-size: 11px; line-height: 1.5; color: #1e293b; font-family: Georgia, serif; }
    .header { margin-bottom: 20px; }
    .name { font-size: 22px; font-weight: bold; color: #0f172a; }
    .contact-line { margin-top: 4px; font-size: 10px; color: #64748b; }
    .contact-line span { margin-right: 2px; }
    .sep { margin: 0 6px; color: #cbd5e1; }
    .section { margin-bottom: 16px; }
    .entry { margin-bottom: 12px; }
    .entry-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .date { font-size: 10px; color: #64748b; white-space: nowrap; margin-left: 16px; }
    ul { margin-top: 4px; padding-left: 16px; }
    li { margin-bottom: 2px; }
    .body { margin-bottom: 4px; }
    strong { font-weight: 600; }
  `
  const variants: Record<TemplateId, string> = {
    modern: `${base}
      .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #7c3aed; border-bottom: 1px solid #ede9fe; padding-bottom: 3px; margin-bottom: 8px; }
    `,
    classic: `${base}
      body { font-family: 'Times New Roman', Times, serif; }
      .name { text-align: center; font-size: 24px; }
      .contact-line { text-align: center; }
      .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid #94a3b8; padding-bottom: 2px; margin-bottom: 8px; color: #0f172a; }
    `,
    minimal: `${base}
      body { font-family: system-ui, -apple-system, sans-serif; color: #374151; }
      .name { font-size: 18px; font-weight: 600; color: #111827; }
      .section-title { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; margin-bottom: 8px; }
    `,
    executive: `${base}
      .name { font-size: 26px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
      .header { border-top: 3px solid #0f172a; border-bottom: 1px solid #e2e8f0; padding: 12px 0; margin-bottom: 20px; }
      .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 8px; color: #0f172a; }
    `,
  }
  return variants[template] ?? variants.modern
}

function esc(s: string | undefined): string {
  if (!s) return ''
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
