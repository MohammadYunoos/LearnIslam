// scripts/i18n-coverage.mjs
// Coverage + drift report for curated translations.
//
// Compares two sets:
//   LIVE   = every user-facing English string found in the app source
//            (useTr / useTrList args, PageHeader title/subtitle, and the
//             text/title/meaning/translation/desc/intro/stepsTitle fields in
//             src/content/*.ts)
//   CURATED = every `en` in src/content/i18n/*.i18n.ts
//
// Reports:
//   MISSING  — live strings with no curated ur/roman (fall back to MT)
//   ORPHANED — curated entries whose `en` no longer appears in the source
//              (English was edited/removed → hash drift → override dead)
//
// Run:  node scripts/i18n-coverage.mjs
// Exit code 1 if anything is missing/orphaned (usable as a CI gate).
import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = join(root, 'src')
const i18nDir = join(srcDir, 'content', 'i18n')
const reportPath = join(root, 'supabase', 'i18n-coverage.txt')

// ── walk src for .ts/.tsx ─────────────────────────────────
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) {
      if (name === 'node_modules') continue
      walk(p, acc)
    } else if (/\.(ts|tsx)$/.test(name)) {
      acc.push(p)
    }
  }
  return acc
}

const isI18nFile = (p) => p.startsWith(i18nDir)

// ── CURATED set (en -> file) ──────────────────────────────
const curatedRe = /\{ en: '([\s\S]*?)', ur: '([\s\S]*?)', roman: '([\s\S]*?)' \}/g
const curated = new Map() // en -> source i18n file
for (const f of readdirSync(i18nDir).filter((f) => f.endsWith('.i18n.ts'))) {
  const text = readFileSync(join(i18nDir, f), 'utf8')
  let m
  while ((m = curatedRe.exec(text)) !== null) curated.set(m[1], f)
}

// ── LIVE strings from source ──────────────────────────────
// Targeted captures only — avoids className / route / import noise.
const patterns = [
  /useTr\(\s*(['"])([\s\S]*?)\1/g, // useTr('…')
  /\btitle=(['"])([\s\S]*?)\1/g, // <PageHeader title="…">
  /\bsubtitle=(['"])([\s\S]*?)\1/g, // <PageHeader subtitle="…">
  // content object fields
  /\b(?:text|title|subtitle|meaning|translation|desc|intro|stepsTitle|label|message):\s*(['"])([\s\S]*?)\1/g,
]
// useTrList([...]) — grab the array body, then pull string literals from it.
const listRe = /useTrList\(\s*\[([\s\S]*?)\]/g
const litRe = /(['"])((?:\\.|(?!\1)[\s\S])*?)\1/g

function looksUserFacing(s) {
  const t = s.trim()
  if (t.length < 2) return false
  if (!/[A-Za-z]/.test(t)) return false // emoji / punctuation only
  if (/^[a-z0-9]+([-_/.][a-z0-9]+)*$/.test(t)) return false // slug/route/key/filename
  if (/^https?:\/\//.test(t)) return false
  if (/\.(png|jpg|svg|mp3|mjs|ts|tsx|css)$/.test(t)) return false
  return true
}

const live = new Map() // en -> Set(files)
const allSrcText = [] // concatenated source for orphan lookup

for (const f of walk(srcDir)) {
  if (isI18nFile(f)) continue
  const text = readFileSync(f, 'utf8')
  allSrcText.push(text)
  const rel = relative(root, f)
  const add = (s) => {
    if (!looksUserFacing(s)) return
    if (!live.has(s)) live.set(s, new Set())
    live.get(s).add(rel)
  }
  for (const re of patterns) {
    let m
    while ((m = re.exec(text)) !== null) add(m[2])
  }
  let lm
  while ((lm = listRe.exec(text)) !== null) {
    const body = lm[1]
    let sm
    while ((sm = litRe.exec(body)) !== null) add(sm[2])
  }
}
const srcBlob = allSrcText.join('\n')

// ── diff ──────────────────────────────────────────────────
const missing = [...live.keys()].filter((en) => !curated.has(en)).sort()
const orphaned = [...curated.keys()].filter((en) => !srcBlob.includes(en)).sort()

// ── report ────────────────────────────────────────────────
const lines = []
const log = (s = '') => lines.push(s)
log(`i18n coverage report`)
log(`curated entries : ${curated.size}`)
log(`live strings    : ${live.size}`)
log(`missing (no ur/roman) : ${missing.length}`)
log(`orphaned (drifted en) : ${orphaned.length}`)
log()
log(`── MISSING — add these to a src/content/i18n/*.i18n.ts ──`)
for (const en of missing) log(`  [${[...live.get(en)][0]}]  ${en}`)
log()
log(`── ORPHANED — curated en no longer in source (fix en or remove) ──`)
for (const en of orphaned) log(`  [${curated.get(en)}]  ${en}`)
log()

const out = lines.join('\n')
console.log(out)
writeFileSync(reportPath, out + '\n', 'utf8')
console.log(`\n(full report written to ${relative(root, reportPath)})`)

process.exit(missing.length || orphaned.length ? 1 : 0)
