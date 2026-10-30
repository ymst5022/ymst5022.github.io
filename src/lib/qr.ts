// QR コード画像の生成（設計 D2, D3, D8）
import QRCode from 'qrcode'
import { hasText } from './links.ts'

/** 誤り訂正 Q（汚れやかすれに強い）。白地に黒、周囲に4マスの余白、1024px 四方 */
export const QR_OPTIONS = {
  errorCorrectionLevel: 'Q',
  margin: 4,
  width: 1024,
  color: { dark: '#000000', light: '#ffffff' },
} as const

export const QR_FILE_NAME = 'devcard-qr.png'

/** QR に入れる文字列。公開URLが未設定なら null（画面では案内を出す） */
export function qrText(siteUrl: string): string | null {
  return hasText(siteUrl) ? siteUrl.trim() : null
}

/** PNG 画像の data URL を作る */
export function createQrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, QR_OPTIONS)
}

/** QR 画像を PNG ファイルとしてダウンロードさせる */
export function downloadQr(dataUrl: string): void {
  const anchor = document.createElement('a')
  anchor.href = dataUrl
  anchor.download = QR_FILE_NAME
  anchor.click()
}
