import { describe, expect, it } from 'vitest'
import { discordInfo, hasText, nonEmpty, shortUrl, visibleLinks, visibleWorks } from './links.ts'

describe('hasText', () => {
  it('undefined・空文字・空白だけは「値なし」', () => {
    expect(hasText(undefined)).toBe(false)
    expect(hasText('')).toBe(false)
    expect(hasText('   ')).toBe(false)
    expect(hasText('a')).toBe(true)
  })
})

describe('shortUrl', () => {
  it('https:// と末尾の / を除く', () => {
    expect(shortUrl('https://github.com/example/')).toBe('github.com/example')
  })
})

describe('visibleLinks', () => {
  it('値の入っているものだけを GitHub → X → ブログ → メールの順に返す', () => {
    const items = visibleLinks({
      blog: 'https://blog.example.com/',
      github: 'https://github.com/example',
      x: '',
    })
    expect(items.map((item) => item.kind)).toEqual(['github', 'blog'])
  })

  it('何も無ければ空', () => {
    expect(visibleLinks({})).toEqual([])
  })

  it('メールは mailto: のリンクにする', () => {
    expect(visibleLinks({ email: 'me@example.com' })[0].href).toBe('mailto:me@example.com')
  })
})

describe('discordInfo', () => {
  it('ユーザー名が無ければ null', () => {
    expect(discordInfo({})).toBeNull()
    expect(discordInfo({ discord: { username: ' ' } })).toBeNull()
  })

  it('ID が無ければプロフィールURLは出さない', () => {
    expect(discordInfo({ discord: { username: 'example_user' } })).toEqual({ username: 'example_user' })
  })

  it('ID があれば discord.com/users/<ID> を返す', () => {
    expect(discordInfo({ discord: { username: 'example_user', userId: '123' } })?.profileUrl).toBe(
      'https://discord.com/users/123',
    )
  })
})

describe('visibleWorks / nonEmpty', () => {
  it('名前の無い制作物は出さない', () => {
    const works = visibleWorks([
      { name: 'ツールA', summary: '', tech: [] },
      { name: '', summary: '名前なし', tech: [] },
    ])
    expect(works.map((work) => work.name)).toEqual(['ツールA'])
  })

  it('空の要素を除く', () => {
    expect(nonEmpty(['React', ' ', '', 'TypeScript'])).toEqual(['React', 'TypeScript'])
  })
})
