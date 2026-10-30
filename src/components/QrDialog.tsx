import { Copy, Download, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { shortUrl } from '../lib/links.ts'
import { createQrDataUrl, downloadQr, qrText } from '../lib/qr.ts'
import type { Notice } from '../lib/useNotice.ts'
import { Toast } from './Toast.tsx'
import { UnsetUrlNotice } from './UnsetUrlNotice.tsx'

interface Props {
  open: boolean
  onClose: () => void
  siteUrl: string
  onCopy: (text: string, label: string) => void
  notice: Notice | null
  onDismissNotice: () => void
}

type QrImage = { status: 'loading' } | { status: 'ready'; dataUrl: string } | { status: 'error' }

/** イベント会場で相手に見せる、全画面の QR（設計 D7, D8） */
export function QrDialog({ open, onClose, siteUrl, onCopy, notice, onDismissNotice }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const text = qrText(siteUrl)
  const [image, setImage] = useState<QrImage>({ status: 'loading' })

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    if (!text) return
    let cancelled = false
    createQrDataUrl(text)
      .then((dataUrl) => {
        if (!cancelled) setImage({ status: 'ready', dataUrl })
      })
      .catch(() => {
        if (!cancelled) setImage({ status: 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [text])

  return (
    // Esc キーで閉じたときも close イベントが届く
    <dialog ref={dialogRef} className="qr-dialog" aria-labelledby="qr-title" onClose={onClose}>
      <div className="qr-dialog-inner">
        <div className="qr-dialog-head">
          <h2 id="qr-title">QRコード</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="閉じる">
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        {text ? (
          <>
            <div className="qr-frame">
              {image.status === 'ready' && (
                <img src={image.dataUrl} alt={`${shortUrl(text)} を開くQRコード`} width={1024} height={1024} />
              )}
              {image.status === 'loading' && <p>QRコードを作っています…</p>}
              {image.status === 'error' && <p>QRコードを作れませんでした</p>}
            </div>
            <p className="qr-url">{shortUrl(text)}</p>
            <div className="button-row">
              <button type="button" className="button" onClick={() => onCopy(text, 'URL')}>
                <Copy size={20} aria-hidden="true" />
                URLをコピー
              </button>
              <button
                type="button"
                className="button"
                disabled={image.status !== 'ready'}
                onClick={() => image.status === 'ready' && downloadQr(image.dataUrl)}
              >
                <Download size={20} aria-hidden="true" />
                画像を保存
              </button>
            </div>
          </>
        ) : (
          <UnsetUrlNotice />
        )}
      </div>
      {/* 開いている間はページ側の通知が隠れるので、ダイアログの中に出す */}
      <Toast notice={open ? notice : null} onDismiss={onDismissNotice} />
    </dialog>
  )
}
