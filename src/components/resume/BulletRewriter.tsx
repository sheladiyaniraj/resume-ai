'use client'

import { useState } from 'react'
import { Sparkles, Loader2, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  bullet: string
  onApply: (text: string) => void
  onClose: () => void
}

export default function BulletRewriter({ bullet, onApply, onClose }: Props) {
  const [variants, setVariants] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  async function getVariants() {
    if (!bullet.trim()) { toast.error('Write something first'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setVariants(data.variants)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to rewrite bullet')
    }
    setLoading(false)
  }

  return (
    <div className="mt-3 bg-violet-50 border border-violet-200 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-violet-700 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> AI Bullet Rewriter
        </span>
        <button onClick={onClose} className="p-0.5 text-violet-400 hover:text-violet-600">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {variants.length === 0 ? (
        <button
          onClick={getVariants}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white text-xs font-medium py-2 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {loading ? 'Generating variants...' : 'Get 3 stronger variants'}
        </button>
      ) : (
        <div className="space-y-2">
          {variants.map((v, i) => (
            <div key={i} className="flex gap-2 items-start bg-white border border-violet-100 rounded-lg p-2.5">
              <p className="flex-1 text-xs text-slate-700 leading-relaxed">{v}</p>
              <button
                onClick={() => onApply(v)}
                className="p-1 text-emerald-500 hover:bg-emerald-50 rounded transition-colors flex-shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button onClick={getVariants} className="text-xs text-violet-600 hover:underline">
            Regenerate
          </button>
        </div>
      )}
    </div>
  )
}
