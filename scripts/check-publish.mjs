// 公開前の検査（設計 D15、決定 0003・0006）
// 1. profile.ts に下書きの印（TODO）が残っていたら失敗させる
// 2. profile.ts の画像（src: '/...'）が public/ に無いか、1枚 200KB を超えていたら失敗させる
import { existsSync, readFileSync, statSync } from 'node:fs'

const MAX_IMAGE_BYTES = 200 * 1024

const file = new URL('../src/data/profile.ts', import.meta.url)
const text = readFileSync(file, 'utf8')
const lines = text.split(/\r?\n/)
const hits = lines.flatMap((line, index) => (line.includes('TODO') ? [`  ${index + 1}行目: ${line.trim()}`] : []))

if (hits.length > 0) {
  console.error(`src/data/profile.ts に下書き（TODO）が ${hits.length} か所残っています。公開の前に書き直してください。`)
  console.error(hits.join('\n'))
  process.exit(1)
}

const imageProblems = [...text.matchAll(/\bsrc:\s*'(\/[^']+)'/g)].flatMap(([, src]) => {
  const path = new URL(`../public${src}`, import.meta.url)
  if (!existsSync(path)) return [`  ${src}: public/ にありません`]
  const size = statSync(path).size
  return size > MAX_IMAGE_BYTES ? [`  ${src}: ${Math.round(size / 1024)}KB（200KB 以下にしてください）`] : []
})

if (imageProblems.length > 0) {
  console.error('src/data/profile.ts の画像に問題があります。')
  console.error(imageProblems.join('\n'))
  process.exit(1)
}

console.log('src/data/profile.ts に下書き（TODO）は残っていません。画像はすべて public/ にあり、200KB 以下です。')
