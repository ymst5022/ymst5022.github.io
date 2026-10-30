import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { BuiltWork } from '../data/types.ts'
import { BuiltWorksList } from './BuiltWorksList.tsx'

const toolA: BuiltWork = { name: 'ツールA', summary: '説明A', tech: ['Python', 'Gemini'] }
const toolB: BuiltWork = { name: 'ツールB', summary: '説明B', tech: ['Flutter'] }

describe('作ってきたもの', () => {
  it('見出しは「作ってきたもの」', () => {
    expect(renderToStaticMarkup(<BuiltWorksList works={[toolA]} />)).toContain('作ってきたもの')
  })

  it('名前・説明・技術のタグを、並べた順に出す', () => {
    const html = renderToStaticMarkup(<BuiltWorksList works={[toolA, toolB]} />)
    expect(html).toContain('<h3 class="built-name">ツールA</h3><p>説明A</p>')
    expect(html).toContain('<ul class="tags tags-small" aria-label="使用技術"><li>Python</li><li>Gemini</li></ul>')
    expect(html.indexOf('ツールA')).toBeLessThan(html.indexOf('ツールB'))
  })

  it('画像もリンクも出さない', () => {
    const html = renderToStaticMarkup(<BuiltWorksList works={[toolA, toolB]} />)
    expect(html).not.toContain('<img')
    expect(html).not.toContain('<a ')
  })

  it('名前の無いものは出さず、1つも無ければ欄ごと出さない', () => {
    const html = renderToStaticMarkup(<BuiltWorksList works={[{ name: ' ', summary: '説明C', tech: [] }, toolA]} />)
    expect(html).not.toContain('説明C')
    expect(renderToStaticMarkup(<BuiltWorksList works={[]} />)).toBe('')
  })
})
