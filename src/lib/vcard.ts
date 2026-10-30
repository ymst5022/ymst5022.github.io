// 連絡先ファイル（vCard 3.0）の生成（設計 D6）
import type { Profile } from '../data/types.ts'
import { hasText } from './links.ts'

const CRLF = '\r\n'
const MAX_LINE_BYTES = 75
const encoder = new TextEncoder()

/** vCard の値として使えるよう、\ と改行と , ; をエスケープする */
export function escapeValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

/**
 * 1行を UTF-8 で 75 バイト以内に折り返す。続きの行は空白1つで始める。
 * 文字単位で数えるので、日本語や絵文字の途中では切らない。
 */
export function foldLine(line: string): string {
  const parts: string[] = []
  let current = ''
  let bytes = 0
  for (const char of line) {
    const size = encoder.encode(char).length
    if (bytes + size > MAX_LINE_BYTES) {
      parts.push(current)
      current = ' '
      bytes = 1
    }
    current += char
    bytes += size
  }
  parts.push(current)
  return parts.join(CRLF)
}

/** 設定されている項目だけを入れた vCard の文字列を作る */
export function buildVCard(profile: Profile): string {
  const name = escapeValue(profile.handle.trim())
  const lines = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${name}`, `N:${name};;;;`]

  if (hasText(profile.title)) lines.push(`TITLE:${escapeValue(profile.title.trim())}`)

  const { links } = profile
  if (hasText(links.email)) lines.push(`EMAIL;TYPE=INTERNET:${escapeValue(links.email.trim())}`)

  // URL は値の種類が uri なので、, や ; をエスケープしない
  for (const url of [profile.siteUrl, links.github, links.x, links.blog]) {
    if (hasText(url)) lines.push(`URL:${url.trim()}`)
  }

  if (links.discord && hasText(links.discord.username)) {
    lines.push(`NOTE:${escapeValue(`Discord: ${links.discord.username.trim()}`)}`)
  }

  lines.push('END:VCARD')
  return lines.map(foldLine).join(CRLF) + CRLF
}

/** ダウンロード用のファイル名。ファイル名に使えない文字は除き、空なら contact.vcf */
export function vcardFileName(handle: string): string {
  // oxlint-disable-next-line no-control-regex -- 制御文字を取り除くための正規表現
  const safe = handle.replace(/[\\/:*?"<>|\u0000-\u001f]/g, '').trim()
  return `${safe || 'contact'}.vcf`
}

/** vCard を UTF-8 のファイルとしてダウンロードさせる */
export function downloadVCard(profile: Profile): void {
  const blob = new Blob([buildVCard(profile)], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = vcardFileName(profile.handle)
  anchor.click()
  // すぐに解放すると一部のブラウザでダウンロードが始まらないので、少し待つ
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
