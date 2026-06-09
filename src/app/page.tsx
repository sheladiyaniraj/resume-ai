import Link from 'next/link'
import { Sparkles, FileText, Target, Download, ArrowRight, Check } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            <span className="font-semibold text-slate-900 text-lg">ResumeAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Sign in
            </Link>
            <Link
              href="/login"
              className="text-sm bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors font-medium"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          Powered by Claude AI
        </div>
        <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6 max-w-3xl mx-auto">
          Land more interviews with an AI-tailored resume
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Paste a job description, add your experience, and get a perfectly tailored,
          ATS-optimized resume in seconds.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl text-base font-medium hover:bg-violet-700 transition-colors shadow-sm"
          >
            Build my resume <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="text-sm text-slate-400">Free · No credit card required</span>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-5 h-5 text-violet-600" />,
                title: 'AI Tailoring',
                desc: 'Paste a job description and watch AI rewrite your resume to match keywords, tone, and requirements.',
              },
              {
                icon: <Target className="w-5 h-5 text-emerald-600" />,
                title: 'ATS Score',
                desc: 'Get a 0–100 ATS compatibility score with missing keywords and 3 concrete fixes to improve it.',
              },
              {
                icon: <Download className="w-5 h-5 text-blue-600" />,
                title: 'PDF & DOCX Export',
                desc: 'Download a clean, parser-safe PDF or DOCX. Pro plan removes the watermark.',
              },
            ].map((f) => (
              <div key={f.title} className="bg-white p-6 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Simple pricing</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div className="border border-slate-200 rounded-2xl p-8">
            <p className="font-semibold text-slate-900 mb-1">Free</p>
            <p className="text-3xl font-bold text-slate-900 mb-6">$0</p>
            <ul className="space-y-3 mb-8">
              {['1 resume', '3 AI generations/month', 'All templates', 'Watermarked PDF export'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-slate-400" />{f}
                </li>
              ))}
            </ul>
            <Link href="/login" className="block text-center border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              Get started
            </Link>
          </div>
          {/* Pro */}
          <div className="bg-violet-600 rounded-2xl p-8 text-white">
            <p className="font-semibold mb-1">Pro</p>
            <div className="flex items-baseline gap-1 mb-6">
              <p className="text-3xl font-bold">$9</p>
              <span className="text-violet-300 text-sm">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {['Unlimited resumes', 'Unlimited AI generations', 'No watermark', 'ATS scoring', 'All templates', 'Version history'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-violet-100">
                  <Check className="w-4 h-4 text-violet-300" />{f}
                </li>
              ))}
            </ul>
            <Link href="/login" className="block text-center bg-white text-violet-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-50 transition-colors">
              Start Pro trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-medium text-slate-700">ResumeAI</span>
          </div>
          <p className="text-sm text-slate-400">© 2025 ResumeAI</p>
        </div>
      </footer>
    </div>
  )
}
