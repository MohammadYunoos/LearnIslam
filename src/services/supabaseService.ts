// src/services/supabaseService.ts
// All operations now go through the Supabase Edge Function API (see apiClient).
// Function signatures and return shapes are unchanged, so pages need no edits.
import { api } from './apiClient'

// ── HADITH ──────────────────────────────────────────────

export async function getHadeesOfTheDay() {
  return api.get<any>('/hadees/today')
}

// Bulk download of all translations for a language (offline cache seed).
export async function getAllTranslations(target: string) {
  return api.get<{ target: string; count: number; rows: { source_text: string; translated_text: string }[] }>(
    `/translate/all?target=${encodeURIComponent(target)}`
  )
}

// ── MAQTAB ──────────────────────────────────────────────

export async function getMaqtabChapters(lang = 'english') {
  return api.get<any[]>(`/maqtab/chapters?lang=${encodeURIComponent(lang)}`)
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

export interface MaqtabLessonFeedback {
  likeCount: number
  liked: boolean
  rating: number | null
  averageRating: number | null
  ratingCount: number
}

export async function getMaqtabLessonFeedback(lessonId: string) {
  return api.get<MaqtabLessonFeedback>(`/maqtab/lesson/${encodeURIComponent(lessonId)}/feedback`)
}

export async function toggleMaqtabLessonLike(lessonId: string) {
  return api.post<{ likeCount: number; liked: boolean }>(
    `/maqtab/lesson/${encodeURIComponent(lessonId)}/like`
  )
}

export async function rateMaqtabLesson(lessonId: string, rating: number) {
  return api.post<{ rating: number; averageRating: number | null; ratingCount: number }>(
    `/maqtab/lesson/${encodeURIComponent(lessonId)}/rating`,
    { rating }
  )
}

// ── BEGINNER EXAM ───────────────────────────────────────

export interface ExamQuestion {
  id: string
  chapter_num: number
  question: string
  options: string[]
}
export interface ExamAttempt {
  id: string
  score: number
  total: number
  percent: number
  passed: boolean
  elapsed_seconds: number | null
  created_at: string
}
export interface ExamLeaderboardEntry {
  rank: number
  userId: string
  name: string
  age: number | null
  attempts: number
  percent: number
  achievedAt: string
}

export async function getExamQuestions(level = 'Beginner', lang = 'english') {
  return api.get<{ questions: ExamQuestion[]; total: number; passPercent: number }>(
    `/exam/questions?level=${encodeURIComponent(level)}&lang=${encodeURIComponent(lang)}`
  )
}

export async function submitExam(payload: {
  level?: string
  answers: Record<string, number>
  elapsedSeconds: number
}) {
  return api.post<{
    score: number
    total: number
    percent: number
    passed: boolean
    passPercent: number
    results: { id: string; correct_idx: number; chosen: number; ok: boolean }[]
  }>('/exam/submit', { ...payload, level: payload.level || 'Beginner' })
}

export async function getExamAttempts(level = 'Beginner') {
  return api.get<ExamAttempt[]>(`/exam/attempts?level=${encodeURIComponent(level)}`)
}

export async function getExamLeaderboard(level = 'Beginner') {
  return api.get<ExamLeaderboardEntry[]>(
    `/exam/leaderboard?level=${encodeURIComponent(level)}`
  )
}

export async function getKnowledgeCheck(level = 'Beginner', count = 5, lang = 'english') {
  return api.get<
    { id: string; question: string; options: string[]; correct_idx: number; explanation?: string }[]
  >(`/exam/knowledge-check?level=${encodeURIComponent(level)}&count=${count}&lang=${encodeURIComponent(lang)}`)
}

// ── APP VERSION + FEEDBACK ──────────────────────────────

export async function getAppVersion() {
  return api.get<any>('/app/version')
}

export async function getDonationConfig() {
  return api.get<{ buymeacoffee_link: string; upi_vpa: string }>('/donation/config')
}

export async function logDonationTransaction(payload: {
  amount: number
  currency: string
  method: 'bmac' | 'upi'
  status: 'initiated' | 'success' | 'failed'
  error_message?: string
}) {
  return api.post('/donation/log', payload)
}

export async function getDonationTransactions(userId: string) {
  return api.get<Array<{ id: string; created_at: string; status: string }>>(
    `/donation/transactions?userId=${encodeURIComponent(userId)}`
  )
}

export async function sendFeedback(payload: {
  userId?: string
  userName?: string
  screen?: string
  message: string
  context?: string
}) {
  await api.post('/feedback', payload)
}

export async function getFeedback() {
  return api.get<any[]>('/feedback')
}

// ── CURATED TRANSLATION OVERRIDES ───────────────────────

export async function setTranslation(target: string, source: string, text: string) {
  await api.post('/translate/set', { target, source_text: source, translated_text: text })
}

export async function listTranslations(target: string) {
  return api.get<any[]>(`/translate/list?target=${encodeURIComponent(target)}`)
}

// ── ISLAMIC Q&A ─────────────────────────────────────────

export async function getQaVolumes(lang = 'english') {
  return api.get<any[]>(`/qa/volumes?lang=${encodeURIComponent(lang)}`)
}

export async function getQaVolume(id: string) {
  return api.get<any>(`/qa/volume/${id}`)
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

// ── PUSH (FCM) ──────────────────────────────────────────

export async function registerDeviceToken(fcmToken: string, platform = 'android') {
  await api.post('/push/register', { fcmToken, platform })
}

export async function unregisterDeviceToken(fcmToken: string) {
  await api.post('/push/unregister', { fcmToken })
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

// ── INVITES ─────────────────────────────────────────────

export async function getInviteStatus() {
  return api.get<{ ok: boolean; code: string; redeemedCount: number; maqtabUnlocked: boolean; error?: string }>('/invite/status')
}

export async function redeemInviteCode(code: string) {
  return api.post<{ ok: boolean; error?: string; redeemedCount?: number; inviterUnlocked?: boolean }>('/invite/redeem', { code })
}

// Backward-compatible aliases for older call sites.

export async function generateUserCoupon() {
  return getInviteStatus()
}

export async function redeemCoupon(code: string) {
  return redeemInviteCode(code)
}

// ── HELPERS ─────────────────────────────────────────────

export async function logEvent(
  userId: string,
  eventType: string,
  data?: Record<string, unknown>
) {
  await api.post('/events', { userId, eventType, data })
}
