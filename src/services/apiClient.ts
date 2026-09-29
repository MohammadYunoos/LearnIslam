// src/services/apiClient.ts
// Thin client for the Supabase Edge Function API (function name: `api`).
// All app data now flows through this instead of hitting Supabase tables directly.
import { supabase } from '../lib/supabase'

const BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/api`
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY

async function bearerToken(): Promise<string> {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? ANON
}

// Hard cap on any single request so a hung network/proxy can never freeze the
// UI forever (e.g. a huge /translate batch that never returns would otherwise
// leave the translating-overlay stuck and require an app restart).
const REQUEST_TIMEOUT_MS = 25000

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    apikey: ANON,
    Authorization: `Bearer ${await bearerToken()}`,
  }
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS)
  try {
    const res = await fetch(BASE + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    })
    const text = await res.text()
    if (!res.ok) {
      let message = `Request failed (${res.status})`
      try {
        message = JSON.parse(text)?.error || message
      } catch {
        /* Keep the status-based fallback for non-JSON errors. */
      }
      throw new Error(message)
    }
    return (text ? JSON.parse(text) : null) as T
  } finally {
    clearTimeout(timer)
  }
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
}
