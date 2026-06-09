'use client'

import { useState } from 'react'
import { Crown, Check, Loader2, Sparkles } from 'lucide-react'
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Crown className="w-6 h-6 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Upgrade to Pro</h1>
          <p className="text-slate-500 mt-2 text-sm">Unlock unlimited resumes, AI generations, and ATS scoring</p>
        </div>

        <div className="bg-violet-600 rounded-2xl p-8 text-white mb-6">
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-bold">$9</span>
            <span className="text-violet-300">/month</span>
          </div>
          <ul className="space-y-3">
            {[
              'Unlimited resumes',
              'Unlimited AI tailoring',
              'ATS scoring & analysis',
              'No watermark on exports',
              'Version history',
              'All 4 resume templates',
              'Priority support',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-violet-100">
                <Check className="w-4 h-4 text-violet-300 flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={startCheckout}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 mb-3"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? 'Redirecting...' : 'Start Pro Plan'}
        </button>

        <Link href="/dashboard" className="block text-center text-sm text-slate-500 hover:text-slate-700 transition-colors">
          Maybe later
        </Link>
      </div>
    </div>
  )
}
