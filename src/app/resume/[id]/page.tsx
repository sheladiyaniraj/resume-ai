import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ResumeEditorClient from './ResumeEditorClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ResumeEditorPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: resume }, { data: subscription }, { data: versions }] = await Promise.all([
    supabase.from('rb_resumes').select('*').eq('id', id).eq('user_id', user.id).single(),
    supabase.from('rb_subscriptions').select('*').eq('user_id', user.id).single(),
    supabase.from('rb_versions').select('*').eq('resume_id', id).order('created_at', { ascending: false }).limit(10),
  ])

  if (!resume) redirect('/dashboard')

  return (
    <ResumeEditorClient
      resume={resume}
      subscription={subscription}
      versions={versions ?? []}
      userId={user.id}
    />
  )
}
