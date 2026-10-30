// 画面と vCard に出す項目の絞り込み（設計 D5, D9）
import type { Links, Work } from '../data/types.ts'

export type LinkKind = 'github' | 'x' | 'blog' | 'email'

export interface LinkItem {
  kind: LinkKind
  label: string
  href: string
  /** 画面に出す短い表記（例: github.com/ymst5022） */
  display: string
}

export interface DiscordInfo {
  username: string
  /** userId があるときだけ入る */
  profileUrl?: string
}

/** 値が入っている（空白だけではない）文字列か */
export function hasText(value: string | undefined): value is string {
  return value !== undefined && value.trim() !== ''
}

/** URL から https:// と末尾の / を除いた、画面用の短い表記 */
export function shortUrl(url: string): string {
  return url.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
}

/** 値の入っているリンクだけを、画面に出す順に並べる */
export function visibleLinks(links: Links): LinkItem[] {
  const items: LinkItem[] = []
  if (hasText(links.github)) {
    items.push({ kind: 'github', label: 'GitHub', href: links.github.trim(), display: shortUrl(links.github) })
  }
  if (hasText(links.x)) {
    items.push({ kind: 'x', label: 'X', href: links.x.trim(), display: shortUrl(links.x) })
  }
  if (hasText(links.blog)) {
    items.push({ kind: 'blog', label: 'ブログ', href: links.blog.trim(), display: shortUrl(links.blog) })
  }
  if (hasText(links.email)) {
    const email = links.email.trim()
    items.push({ kind: 'email', label: 'メール', href: `mailto:${email}`, display: email })
  }
  return items
}

/** Discord のユーザー名が無ければ null。ID があればプロフィールURLも返す */
export function discordInfo(links: Links): DiscordInfo | null {
  const discord = links.discord
  if (!discord || !hasText(discord.username)) return null
  const info: DiscordInfo = { username: discord.username.trim() }
  if (hasText(discord.userId)) {
    info.profileUrl = `https://discord.com/users/${encodeURIComponent(discord.userId.trim())}`
  }
  return info
}

/** 名前の入っている制作物だけ（「取り組み」と「作ってきたもの」の両方で使う） */
export function visibleWorks<T extends Pick<Work, 'name'>>(works: T[]): T[] {
  return works.filter((work) => hasText(work.name))
}

/** 空の要素を除いた一覧 */
export function nonEmpty(values: string[]): string[] {
  return values.filter(hasText).map((value) => value.trim())
}
