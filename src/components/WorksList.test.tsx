import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { Work } from '../data/types.ts'
import { WorksList } from './WorksList.tsx'

const withImage: Work = {
  name: 'ツールA',
  status: '開発中',
  summary: '説明A',
  tech: ['TypeScript'],
  image: { src: '/works/a.webp', alt: '画面Aの説明', width: 800, height: 600, credit: '立ち絵: テスト' },
}

describe('取り組みのカード（決定 0006）', () => {
  it('見出しは「取り組み」', () => {
    expect(renderToStaticMarkup(<WorksList works={[withImage]} />)).toContain('取り組み')
  })

  it('画像は説明・大きさ・後から読む指定つきで出し、押すと新しいタブで開く', () => {
    const html = renderToStaticMarkup(<WorksList works={[withImage]} />)
    expect(html).toContain('alt="画面Aの説明"')
    expect(html).toContain('width="800"')
    expect(html).toContain('height="600"')
    expect(html).toContain('loading="lazy"')
    expect(html).toMatch(/<a href="\/works\/a\.webp" target="_blank" rel="noopener noreferrer"/)
  })

  it('「開発中」の印とクレジットを出す', () => {
    const html = renderToStaticMarkup(<WorksList works={[withImage]} />)
    expect(html).toContain('<span class="work-status">開発中</span>')
    expect(html).toContain('<figcaption class="work-credit">立ち絵: テスト</figcaption>')
  })

  it('repoUrl・url が無ければリンクは出さない', () => {
    const html = renderToStaticMarkup(<WorksList works={[withImage]} />)
    expect(html).not.toContain('GitHub')
    expect(html).not.toContain('公開ページ')
  })

  it('画像・印・クレジットが無いカードでは、それらを出さない', () => {
    const html = renderToStaticMarkup(<WorksList works={[{ name: 'ツールB', summary: '説明B', tech: [] }]} />)
    expect(html).toContain('ツールB')
    expect(html).not.toContain('<img')
    expect(html).not.toContain('work-status')
    expect(html).not.toContain('work-credit')
  })

  it('名前のある取り組みが無ければ、欄ごと出さない', () => {
    expect(renderToStaticMarkup(<WorksList works={[]} />)).toBe('')
  })
})
