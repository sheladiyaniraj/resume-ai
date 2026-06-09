'use client'

import { useState } from 'react'
import { Crown, Check, Loader2, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function UpgradePage() {
  const [loading, setLoading] = useState(false)

  async function startCheckout() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to start checkout')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#1A6FE8' }}>
      {/* Background dots */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
        backgroundSize: '28px 28px'
      }} />

      <div className="relative max-w-md w-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#3DD94A' }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-white text-xl">ResumeAI</span>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header band */}
          <div className="px-8 pt-8 pb-6" style={{ backgroundColor: '#1459BF' }}>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5" style={{ color: '#F5A623' }} />
              <span className="font-black text-white text-lg">Upgrade to Pro</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-white">$9</span>
              <span className="text-blue-300 text-sm">/month</span>
            </div>
          </div>

          <div className="px-8 py-6">
            <ul className="space-y-3 mb-6">
              {[
                'Unlimited resumes',
                'Unlimited AI tailoring',
                'ATS scoring & analysis',
                'No watermark on exports',
                'Version history',
                'All 4 resume templates',
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#3DD94A' }}>
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={startCheckout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white py-3.5 rounded-full font-black text-sm hover:opacity-90 transition-opacity disabled:opacity-50 mb-3"
              style={{ backgroundColor: '#F5A623', color: '#0D3C8A' }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? 'Redirecting to checkout...' : 'Start Pro Plan'}
            </button>

            <Link href="/dashboard" className="block text-center text-xs text-slate-400 hover:text-slate-600 transition-colors">
              Maybe later
            </Link>
          </div>
        </div>

        <p className="text-center text-blue-200 text-xs mt-4">Secure checkout · Cancel anytime</p>
      </div>
    </div>
  )
}
