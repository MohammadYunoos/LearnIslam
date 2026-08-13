// src/lib/admin.ts
import { supabase } from './supabase'

// Emails allowed to see the feedback admin list. Add reviewers here.
export const ADMIN_EMAILS = ['lucky.yuny@gmail.com']

export async function isAdmin(): Promise<boolean> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const email = session?.user?.email?.toLowerCase()
  return !!email && ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email)
}
