import Link from 'next/link'
import { Sparkles, FileText, Target, Download, ArrowRight, Check, Zap, BarChart2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Nav ── */}
      <nav style={{ backgroundColor: '#1459BF' }} className="border-b border-blue-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3DD94A' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-white text-xl tracking-tight">ResumeAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-blue-200 hover:text-white transition-colors font-medium">
              Sign in
            </Link>
            <Link
              href="/login"
              className="text-sm font-bold px-4 py-2 rounded-full transition-colors"
              style={{ backgroundColor: '#F5A623', color: '#0D3C8A' }}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ backgroundColor: '#1A6FE8' }} className="py-20 px-6 overflow-hidden relative">
        {/* decorative dots */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />

        <div className="max-w-6xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5" style={{ color: '#F5A623' }} />
                Powered by Claude AI
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
                BUILD A RESUME<br />
                THAT GETS YOU{' '}
                <span className="italic" style={{ color: '#3DD94A' }}>HIRED!</span>
              </h1>

              <div className="w-12 h-1 rounded-full mb-6" style={{ backgroundColor: '#F5A623' }} />

              <p className="text-lg text-blue-100 mb-8 leading-relaxed max-w-md">
                Paste a job description, add your experience, and get a perfectly
                tailored ATS-optimized resume in seconds.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 font-black text-base px-8 py-4 rounded-full shadow-lg transition-transform hover:scale-105"
                  style={{ backgroundColor: '#F5A623', color: '#0D3C8A' }}
                >
                  BUILD MY RESUME <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-blue-200 text-sm self-center">Free · No credit card required</p>
              </div>

              {/* Social proof */}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['#3DD94A','#F5A623','#fff','#1459BF'].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-blue-600 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: c, color: '#0D3C8A' }}>
                      {['J','M','S','R'][i]}
                    </div>
                  ))}
                </div>
                <p className="text-blue-100 text-sm"><span className="font-bold text-white">2,400+</span> resumes built this week</p>
              </div>
            </div>

            {/* Right — mock resume card */}
            <div className="hidden md:flex justify-center">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-72 rotate-2 relative">
                <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full flex items-center justify-center text-center text-xs font-black leading-tight shadow-lg" style={{ backgroundColor: '#F5A623', color: '#0D3C8A' }}>
                  ATS<br />SAFE
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#1A6FE8' }}>
                    JD
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Jane Doe</div>
                    <div className="text-xs" style={{ color: '#1A6FE8' }}>Software Engineer</div>
                  </div>
                </div>
                {[
                  { label: 'PROFESSIONAL SUMMARY', lines: [80, 95, 60] },
                  { label: 'EXPERIENCE', lines: [90, 75, 85, 50] },
                  { label: 'SKILLS', lines: [40, 55, 45] },
                ].map(s => (
                  <div key={s.label} className="mb-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#1A6FE8' }} />
                      <span className="text-xs font-bold" style={{ color: '#1A6FE8' }}>{s.label}</span>
                    </div>
                    {s.lines.map((w, i) => (
                      <div key={i} className="h-1.5 rounded-full bg-slate-100 mb-1" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="bg-slate-900 py-2.5 overflow-hidden">
        <div className="flex gap-8 animate-none whitespace-nowrap">
          {Array(6).fill(['ATS-OPTIMIZED', 'AI-POWERED', 'INSTANT RESULTS', 'RECRUITER APPROVED', 'FREE TO START']).flat().map((t, i) => (
            <span key={i} className="text-xs font-bold text-white inline-flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: '#3DD94A' }} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-slate-900 mb-3">
              Everything you need to land the job
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">Professional templates and AI tools that get you noticed by recruiters.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <FileText className="w-5 h-5 text-white" />,
                bg: '#1A6FE8',
                title: 'Professional Templates',
                desc: 'Stand out with 4 clean, ATS-safe designs that parse perfectly.',
              },
              {
                icon: <Zap className="w-5 h-5 text-white" />,
                bg: '#22B830',
                title: 'Easy & Fast',
                desc: 'Build your resume in minutes, not hours. AI does the heavy lifting.',
              },
              {
                icon: <BarChart2 className="w-5 h-5 text-white" />,
                bg: '#F5A623',
                title: 'Land More Interviews',
                desc: 'ATS scoring shows exactly what to fix. Optimized content gets you noticed.',
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: f.bg }}>
                  {f.icon}
                </div>
                <h3 className="font-black text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Feature callout ── */}
      <section style={{ backgroundColor: '#1A6FE8' }} className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-black text-white mb-4">
              AI tailors your resume to <span style={{ color: '#3DD94A' }}>every job</span>
            </h2>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Paste a job description and watch Claude AI rewrite your summary and bullets
              to match keywords, tone, and ATS requirements — in under 10 seconds.
            </p>
            <ul className="space-y-3">
              {['Keyword matching & ATS scoring', 'Action-verb bullet rewrites with metrics', 'Before/after diff view', 'Unlimited on Pro plan'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-blue-100">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#3DD94A' }}>
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="text-xs font-bold text-blue-200 mb-3 uppercase tracking-wider">AI Tailoring in action</div>
            <div className="space-y-3">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-xs text-blue-200 mb-1">Before</p>
                <p className="text-sm text-white/70 line-through">Helped with backend development tasks</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 rotate-90" style={{ color: '#3DD94A' }} />
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: 'rgba(61,217,74,0.15)', borderColor: '#3DD94A', borderWidth: 1 }}>
                <p className="text-xs mb-1" style={{ color: '#3DD94A' }}>After (AI-rewritten)</p>
                <p className="text-sm text-white">Architected REST APIs serving 2M+ requests/day, reducing p99 latency by 40%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section style={{ backgroundColor: '#3DD94A' }} className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-2">Simple pricing</h2>
          <p className="text-center text-slate-700 mb-12">Start free. Upgrade when you're ready.</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <p className="font-black text-slate-900 text-lg mb-1">Free</p>
              <p className="text-4xl font-black text-slate-900 mb-6">$0</p>
              <ul className="space-y-3 mb-8">
                {['1 resume', '3 AI generations/month', 'All 4 templates', 'Watermarked PDF export'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-slate-400" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block text-center border-2 border-slate-200 text-slate-700 px-4 py-2.5 rounded-full text-sm font-bold hover:border-slate-300 transition-colors">
                Get started free
              </Link>
            </div>
            {/* Pro */}
            <div className="rounded-2xl p-8 shadow-lg relative overflow-hidden" style={{ backgroundColor: '#1A6FE8' }}>
              <div className="absolute top-4 right-4 text-xs font-black px-3 py-1 rounded-full" style={{ backgroundColor: '#F5A623', color: '#0D3C8A' }}>
                MOST POPULAR
              </div>
              <p className="font-black text-white text-lg mb-1">Pro</p>
              <div className="flex items-baseline gap-1 mb-6">
                <p className="text-4xl font-black text-white">$9</p>
                <span className="text-blue-200 text-sm">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Unlimited resumes', 'Unlimited AI generations', 'No watermark on exports', 'ATS scoring & analysis', 'Version history', 'All 4 templates'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-blue-100">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#3DD94A' }}>
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block text-center font-black px-4 py-2.5 rounded-full text-sm transition-transform hover:scale-105" style={{ backgroundColor: '#F5A623', color: '#0D3C8A' }}>
                Start Pro Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="py-16 px-6 bg-slate-900 text-center">
        <h2 className="text-3xl font-black text-white mb-4">
          Ready to land more interviews?
        </h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">Join thousands of job seekers who build smarter resumes with AI.</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 font-black text-base px-8 py-4 rounded-full transition-transform hover:scale-105"
          style={{ backgroundColor: '#F5A623', color: '#0D3C8A' }}
        >
          BUILD MY RESUME <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-slate-500 text-xs mt-4">Secure. Private. Yours.</p>
      </section>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: '#1459BF' }} className="py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: '#3DD94A' }}>
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-black text-white">ResumeAI</span>
          </div>
          <p className="text-xs text-blue-300">© 2025 ResumeAI · All rights reserved</p>
        </div>
      </footer>
    </div>
  )
}
