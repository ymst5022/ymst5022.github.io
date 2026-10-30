import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { makeProfile } from '../lib/testProfile.ts'
import { QrDialog } from './QrDialog.tsx'
import { ShareActions } from './ShareActions.tsx'

const noop = () => {}

function renderDialog(siteUrl: string): string {
  return renderToStaticMarkup(
    <QrDialog open={false} onClose={noop} siteUrl={siteUrl} onCopy={noop} notice={null} onDismissNotice={noop} />,
  )
}

describe('公開URLが未設定のとき（設計 D3）', () => {
  it('ページ下部では URL コピーの代わりに案内を出す', () => {
    const html = renderToStaticMarkup(<ShareActions profile={makeProfile({ siteUrl: '' })} onCopy={noop} />)
    expect(html).toContain('公開URLが未設定です')
    expect(html).not.toContain('URLをコピー')
    expect(html).toContain('連絡先を保存')
  })

  it('QR の画面では QR・URL コピー・画像保存の代わりに案内を出す', () => {
    const html = renderDialog('')
    expect(html).toContain('公開URLが未設定です')
    expect(html).not.toContain('URLをコピー')
    expect(html).not.toContain('画像を保存')
  })

  it('設定されていれば案内は出さない', () => {
    const html = renderDialog('https://example.github.io/')
    expect(html).not.toContain('公開URLが未設定です')
    expect(html).toContain('URLをコピー')
    expect(html).toContain('画像を保存')
  })
})
