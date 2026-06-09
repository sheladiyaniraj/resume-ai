import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: resumes }, { data: subscription }] = await Promise.all([
    supabase.from('rb_resumes').select('*').order('updated_at', { ascending: false }),
    supabase.from('rb_subscriptions').select('*').eq('user_id', user.id).single(),
  ])

  return (
    <DashboardClient
      user={user}
      initialResumes={resumes ?? []}
      subscription={subscription}
    />
  )
}
