'use client'

import { useResumeStore } from '@/store/resumeStore'

export default function ContactSection() {
  const { content, updateContent } = useResumeStore()
  const { contact } = content

  function update(field: string, value: string) {
    updateContent((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }))
  }

  const fields = [
    { key: 'fullName', label: 'Full Name', placeholder: 'Jane Smith', required: true },
    { key: 'email', label: 'Email', placeholder: 'jane@example.com', required: true },
    { key: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000' },
    { key: 'location', label: 'Location', placeholder: 'San Francisco, CA' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/jane' },
    { key: 'github', label: 'GitHub', placeholder: 'github.com/jane' },
    { key: 'website', label: 'Website', placeholder: 'jane.dev' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {fields.map(({ key, label, placeholder, required }) => (
        <div key={key} className={key === 'fullName' ? 'col-span-2' : ''}>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            {label}{required && <span className="text-red-400 ml-0.5">*</span>}
          </label>
          <input
            value={(contact as unknown as Record<string, string>)[key] ?? ''}
            onChange={(e) => update(key, e.target.value)}
            placeholder={placeholder}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1A6FE8] focus:border-transparent transition-colors"
          />
        </div>
      ))}
    </div>
  )
}
