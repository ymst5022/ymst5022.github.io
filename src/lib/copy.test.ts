import { describe, expect, it } from 'vitest'
import { copyText, type ClipboardWriter } from './copy.ts'

describe('copyText', () => {
  it('成功したら「コピーしました」', async () => {
    const written: string[] = []
    const clipboard: ClipboardWriter = {
      writeText: async (text) => {
        written.push(text)
      },
    }
    const result = await copyText('https://example.github.io/', 'URL', clipboard)
    expect(result).toEqual({ ok: true, message: 'URLをコピーしました' })
    expect(written).toEqual(['https://example.github.io/'])
  })

  it('書き込みに失敗したら「コピーできませんでした」', async () => {
    const clipboard: ClipboardWriter = {
      writeText: async () => {
        throw new Error('denied')
      },
    }
    const result = await copyText('example_user', 'Discordのユーザー名', clipboard)
    expect(result).toEqual({ ok: false, message: 'Discordのユーザー名をコピーできませんでした' })
  })

  it('クリップボードが使えない環境でも「コピーできませんでした」', async () => {
    const result = await copyText('x', 'URL', null)
    expect(result).toEqual({ ok: false, message: 'URLをコピーできませんでした' })
  })
})
