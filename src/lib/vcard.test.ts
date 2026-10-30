import { describe, expect, it } from 'vitest'
import { profile } from '../data/profile.ts'
import { makeProfile } from './testProfile.ts'
import { buildVCard, escapeValue, foldLine, vcardFileName } from './vcard.ts'

const encoder = new TextEncoder()

function unfold(vcard: string): string[] {
  return vcard.replace(/\r\n /g, '').split('\r\n').filter((line) => line !== '')
}

describe('escapeValue', () => {
  it('\\ , ; と改行をエスケープする', () => {
    expect(escapeValue('a\\b,c;d\ne\r\nf')).toBe('a\\\\b\\,c\\;d\\ne\\nf')
  })
})

describe('foldLine', () => {
  it('75バイト以下の行はそのまま', () => {
    const line = 'a'.repeat(75)
    expect(foldLine(line)).toBe(line)
  })

  it('長い行は75バイト以内で折り返し、続きの行は空白で始まる', () => {
    const folded = foldLine('NOTE:' + 'あ'.repeat(60))
    const lines = folded.split('\r\n')
    expect(lines.length).toBeGreaterThan(1)
    for (const line of lines) expect(encoder.encode(line).length).toBeLessThanOrEqual(75)
    for (const line of lines.slice(1)) expect(line.startsWith(' ')).toBe(true)
  })

  it('日本語や絵文字の途中で切らない（元に戻すと同じ文字列になる）', () => {
    const original = 'NOTE:' + '漢字😀'.repeat(40)
    const folded = foldLine(original)
    expect(folded.replace(/\r\n /g, '')).toBe(original)
    // 絵文字の途中で切れていると、UTF-8 にしたときに壊れて元に戻らない
    const decoder = new TextDecoder()
    for (const line of folded.split('\r\n')) expect(decoder.decode(encoder.encode(line))).toBe(line)
  })
})

describe('buildVCard', () => {
  it('vCard 3.0 の形で、改行は CRLF', () => {
    const vcard = buildVCard(makeProfile())
    expect(vcard.startsWith('BEGIN:VCARD\r\nVERSION:3.0\r\n')).toBe(true)
    expect(vcard.endsWith('END:VCARD\r\n')).toBe(true)
    expect(vcard.replace(/\r\n/g, '')).not.toMatch(/[\r\n]/)
  })

  it('ハンドルネーム・肩書き・URL・Discord ユーザー名を入れる', () => {
    const lines = unfold(
      buildVCard(
        makeProfile({
          links: {
            github: 'https://github.com/example',
            x: 'https://x.com/example',
            blog: 'https://blog.example.com/',
            discord: { username: 'example_user', userId: '123' },
          },
        }),
      ),
    )
    expect(lines).toContain('FN:テスト太郎')
    expect(lines).toContain('N:テスト太郎;;;;')
    expect(lines).toContain('TITLE:個人開発者')
    expect(lines).toContain('URL:https://example.github.io/')
    expect(lines).toContain('URL:https://github.com/example')
    expect(lines).toContain('URL:https://x.com/example')
    expect(lines).toContain('URL:https://blog.example.com/')
    expect(lines).toContain('NOTE:Discord: example_user')
  })

  it('値の無い項目は出さない', () => {
    const lines = unfold(buildVCard(makeProfile({ title: '', siteUrl: '', links: { blog: '  ' } })))
    expect(lines.some((line) => line.startsWith('TITLE'))).toBe(false)
    expect(lines.some((line) => line.startsWith('URL'))).toBe(false)
    expect(lines.some((line) => line.startsWith('NOTE'))).toBe(false)
    expect(lines.some((line) => line.startsWith('EMAIL'))).toBe(false)
  })

  it('メールは設定したときだけ出す', () => {
    const lines = unfold(buildVCard(makeProfile({ links: { email: 'me@example.com' } })))
    expect(lines).toContain('EMAIL;TYPE=INTERNET:me@example.com')
  })

  it('特殊文字を含む肩書きはエスケープされる', () => {
    const lines = unfold(buildVCard(makeProfile({ title: 'AI, 自動化; ツール' })))
    expect(lines).toContain('TITLE:AI\\, 自動化\\; ツール')
  })

  it('いまの profile.ts からはメールが出ない（決定 0002）', () => {
    expect(buildVCard(profile)).not.toMatch(/^EMAIL/m)
  })
})

describe('vcardFileName', () => {
  it('ファイル名に使えない文字を除く', () => {
    expect(vcardFileName('a/b:c*?')).toBe('abc.vcf')
  })

  it('空なら contact.vcf', () => {
    expect(vcardFileName(' / ')).toBe('contact.vcf')
  })
})
