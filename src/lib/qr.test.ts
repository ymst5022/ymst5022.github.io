import QRCode from 'qrcode'
import { describe, expect, it } from 'vitest'
import { profile } from '../data/profile.ts'
import { QR_OPTIONS, createQrDataUrl, qrText } from './qr.ts'

const PUBLIC_URL = 'https://ymst5022.github.io/'

/** QR に実際に入った文字列を、生成結果のデータから組み立て直す */
function encodedText(text: string): string {
  const decoder = new TextDecoder()
  return QRCode.create(text, { errorCorrectionLevel: QR_OPTIONS.errorCorrectionLevel })
    .segments.map((segment) => (typeof segment.data === 'string' ? segment.data : decoder.decode(segment.data)))
    .join('')
}

describe('qrText', () => {
  it('profile.ts の公開URLをそのまま QR に入れる（決定 0001）', () => {
    expect(qrText(profile.siteUrl)).toBe(PUBLIC_URL)
  })

  it('公開URLが空なら null（画面では案内を出す）', () => {
    expect(qrText('')).toBeNull()
    expect(qrText('  ')).toBeNull()
  })
})

describe('QR の中身と大きさ', () => {
  it('QR に入るのは公開URLの文字列だけ', () => {
    expect(encodedText(PUBLIC_URL)).toBe(PUBLIC_URL)
  })

  it('誤り訂正 Q でも、M と同じ大きさ（version）になる', () => {
    const q = QRCode.create(PUBLIC_URL, { errorCorrectionLevel: 'Q' })
    const m = QRCode.create(PUBLIC_URL, { errorCorrectionLevel: 'M' })
    expect(QR_OPTIONS.errorCorrectionLevel).toBe('Q')
    expect(q.version).toBe(m.version)
  })

  it('PNG 画像の data URL を作る', async () => {
    const dataUrl = await createQrDataUrl(PUBLIC_URL)
    expect(dataUrl.startsWith('data:image/png;base64,')).toBe(true)
  })
})
