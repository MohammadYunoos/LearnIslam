// src/services/supabaseService.ts
// All operations now go through the Supabase Edge Function API (see apiClient).
// Function signatures and return shapes are unchanged, so pages need no edits.
import { api } from './apiClient'

// ── HADITH ──────────────────────────────────────────────

export async function getHadeesOfTheDay() {
  return api.get<any>('/hadees/today')
}

// ── MAQTAB ──────────────────────────────────────────────

export async function getMaqtabChapters() {
  return api.get<any[]>('/maqtab/chapters')
}

export async function getLessonContent(lessonId: string) {
  return api.get<any>(`/maqtab/lesson/${lessonId}`)
}

export async function getQuiz(lessonId: string) {
  return api.get<any[]>(`/maqtab/quiz/${lessonId}`)
}

export async function getMaqtabProgress(userId: string) {
  return api.get<{ lesson_id: string; quiz_score: number }[]>(
    `/maqtab/progress?userId=${encodeURIComponent(userId)}`
  )
}

export async function completeLesson(userId: string, lessonId: string, score: number) {
  await api.post('/maqtab/complete', { userId, lessonId, score })
}

// ── HIFZ ────────────────────────────────────────────────

export async function getHifzSurahs(isPremium: boolean) {
  return api.get<any[]>(`/hifz/surahs?premium=${isPremium}`)
}

export async function getHifzProgress(userId: string) {
  return api.get<any[]>(`/hifz/progress?userId=${encodeURIComponent(userId)}`)
}

export async function updateHifzStatus(
  userId: string,
  surahId: number,
  status: 'NotStarted' | 'InProgress' | 'Completed'
) {
  await api.post('/hifz/status', { userId, surahId, status })
}

// ── WAJIFA ──────────────────────────────────────────────

export async function getWajifaCategories() {
  return api.get<any[]>('/wajifa/categories')
}

export async function getTasbihProgress(userId: string) {
  return api.get<any[]>(`/tasbih/progress?userId=${encodeURIComponent(userId)}`)
}

export async function saveTasbihCount(userId: string, wajifaId: number, count: number) {
  await api.post('/tasbih/save', { userId, wajifaId, count })
}

// ── ANALYZER ────────────────────────────────────────────

export async function getAnalyzerSummary(userId: string) {
  return api.get<{
    hifzBasicCompleted: number
    hifzBasicTotal: number
    lessonsCompleted: number
    streakDays: number
    staleSurahId: number | null
    recentEvents: { event_type: string; created_at: string }[]
  }>(`/analyzer/summary?userId=${encodeURIComponent(userId)}`)
}

// ── MASAIL ──────────────────────────────────────────────

export async function askMasail(question: string, madhab: string): Promise<string> {
  const res = await api.post<{ answer: string }>('/masail', { question, madhab })
  return res?.answer ?? 'Unable to answer right now. Please consult your local Alim.'
}

// ── HELPERS ─────────────────────────────────────────────

export async function logEvent(
  userId: string,
  eventType: string,
  data?: Record<string, unknown>
) {
  await api.post('/events', { userId, eventType, data })
}
