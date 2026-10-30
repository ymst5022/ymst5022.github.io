import { Copy, ExternalLink, Mail, PenLine } from 'lucide-react'
import type { Links } from '../data/types.ts'
import { discordInfo, visibleLinks, type LinkKind } from '../lib/links.ts'
import { BrandIcon } from './BrandIcon.tsx'

interface Props {
  links: Links
  onCopy: (text: string, label: string) => void
}

function LinkIcon({ kind }: { kind: LinkKind }) {
  switch (kind) {
    case 'github':
      return <BrandIcon brand="github" />
    case 'x':
      return <BrandIcon brand="x" />
    case 'blog':
      return <PenLine size={20} aria-hidden="true" />
    case 'email':
      return <Mail size={20} aria-hidden="true" />
  }
}

/** GitHub・X・ブログ・Discord など。値の無いものは出さない（設計 D5, D9, D18） */
export function ConnectLinks({ links, onCopy }: Props) {
  const items = visibleLinks(links)
  const discord = discordInfo(links)
  if (items.length === 0 && !discord) return null

  return (
    <section className="section" aria-labelledby="connect-title">
      <h2 id="connect-title" className="section-title">
        つながる
      </h2>
      <ul className="link-list">
        {items.map((item) => {
          const external = item.kind !== 'email'
          return (
            <li key={item.kind}>
              <a
                className="link-row"
                href={item.href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span className="link-icon">
                  <LinkIcon kind={item.kind} />
                </span>
                <span className="link-text">
                  <span className="link-label">{item.label}</span>
                  <span className="link-display">{item.display}</span>
                </span>
                {external && (
                  <>
                    <ExternalLink className="link-arrow" size={18} aria-hidden="true" />
                    <span className="visually-hidden">（新しいタブで開きます）</span>
                  </>
                )}
              </a>
            </li>
          )
        })}

        {discord && (
          <li className="link-row">
            <span className="link-icon">
              <BrandIcon brand="discord" />
            </span>
            <span className="link-text">
              <span className="link-label">Discord</span>
              <span className="link-display">{discord.username}</span>
            </span>
            <button
              type="button"
              className="icon-button"
              onClick={() => onCopy(discord.username, 'Discordのユーザー名')}
              aria-label="Discordのユーザー名をコピー"
            >
              <Copy size={18} aria-hidden="true" />
            </button>
            {discord.profileUrl && (
              <a
                className="icon-button"
                href={discord.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discordのプロフィールを開く（新しいタブで開きます）"
              >
                <ExternalLink size={18} aria-hidden="true" />
              </a>
            )}
          </li>
        )}
      </ul>
    </section>
  )
}
