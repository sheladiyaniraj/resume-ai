'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  async function signInWithGoogle() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { toast.error(error.message); setLoading(false) }
  }

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) toast.error(error.message)
    else setSent(true)
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#1A6FE8' }}>
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#3DD94A' }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-white text-2xl">ResumeAI</span>
          </div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Build a resume that<br />
            gets you <span style={{ color: '#3DD94A' }}>hired!</span>
          </h2>
          <div className="w-10 h-1 rounded-full mb-6" style={{ backgroundColor: '#F5A623' }} />
          <p className="text-blue-200 text-base leading-relaxed max-w-sm">
            AI-tailored resumes in seconds. ATS-optimized, recruiter-approved.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1A6FE8' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-slate-900">ResumeAI</span>
          </div>

          {sent ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#EFF6FF' }}>
                <Mail className="w-7 h-7" style={{ color: '#1A6FE8' }} />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2">Check your email</h2>
              <p className="text-sm text-slate-500">We sent a magic link to <strong>{email}</strong></p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-black text-slate-900 mb-1">Welcome back</h1>
              <p className="text-sm text-slate-500 mb-6">Sign in to continue building your resume</p>

              <button
                onClick={signInWithGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 border-2 border-slate-200 text-slate-700 px-4 py-3 rounded-xl text-sm font-bold hover:border-slate-300 transition-colors disabled:opacity-50 mb-4"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-slate-400">or continue with email</span>
                </div>
              </div>

              <form onSubmit={signInWithEmail} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors"
                  style={{ focusBorderColor: '#1A6FE8' } as React.CSSProperties}
                  onFocus={e => e.target.style.borderColor = '#1A6FE8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full text-white px-4 py-3 rounded-xl text-sm font-black disabled:opacity-50 transition-opacity"
                  style={{ backgroundColor: '#1A6FE8' }}
                >
                  {loading ? 'Sending...' : 'Send magic link'}
                </button>
              </form>

              <p className="text-xs text-slate-400 text-center mt-5">
                By continuing you agree to our Terms of Service and Privacy Policy.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
