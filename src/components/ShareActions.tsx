import { Copy, UserPlus } from 'lucide-react'
import type { Profile } from '../data/types.ts'
import { qrText } from '../lib/qr.ts'
import { downloadVCard } from '../lib/vcard.ts'
import { UnsetUrlNotice } from './UnsetUrlNotice.tsx'

interface Props {
  profile: Profile
  onCopy: (text: string, label: string) => void
}

/** ページ最下部の「連絡先を保存」「URLをコピー」。読み取った相手が使う（設計 D7） */
export function ShareActions({ profile, onCopy }: Props) {
  const url = qrText(profile.siteUrl)

  return (
    <section className="section" aria-labelledby="share-title">
      <h2 id="share-title" className="section-title">
        保存・共有
      </h2>
      <div className="button-row">
        <button type="button" className="button button-primary" onClick={() => downloadVCard(profile)}>
          <UserPlus size={20} aria-hidden="true" />
          連絡先を保存
        </button>
        {url && (
          <button type="button" className="button" onClick={() => onCopy(url, 'URL')}>
            <Copy size={20} aria-hidden="true" />
            URLをコピー
          </button>
        )}
      </div>
      {!url && <UnsetUrlNotice />}
    </section>
  )
}
