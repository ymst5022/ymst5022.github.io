// クリップボードへのコピーと、通知に出す文（設計 D10）

export interface ClipboardWriter {
  writeText(text: string): Promise<void>
}

export interface CopyResult {
  ok: boolean
  message: string
}

/**
 * text をコピーし、通知に出す文を返す。label は「URL」「Discordのユーザー名」など。
 * クリップボードが使えない環境（古いブラウザなど）でも失敗の文を返す。
 */
export async function copyText(
  text: string,
  label: string,
  clipboard: ClipboardWriter | null = globalThis.navigator?.clipboard ?? null,
): Promise<CopyResult> {
  try {
    if (!clipboard) throw new Error('Clipboard API is not available')
    await clipboard.writeText(text)
    return { ok: true, message: `${label}をコピーしました` }
  } catch {
    return { ok: false, message: `${label}をコピーできませんでした` }
  }
}
