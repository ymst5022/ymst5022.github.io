import { X } from 'lucide-react'
import type { Notice } from '../lib/useNotice.ts'

interface Props {
  notice: Notice | null
  onDismiss: () => void
}

/** 読み上げソフトにも伝わる通知欄。欄そのものは常に置いておき、中身だけを入れ替える */
export function Toast({ notice, onDismiss }: Props) {
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {notice && (
        <div key={notice.id} className={notice.detail === undefined ? 'toast' : 'toast toast-error'}>
          <div className="toast-body">
            <p className="toast-message">{notice.message}</p>
            {notice.detail !== undefined && (
              <label className="toast-detail">
                <span>長押しや選択でコピーしてください</span>
                <input readOnly value={notice.detail} onFocus={(event) => event.currentTarget.select()} />
              </label>
            )}
          </div>
          {notice.detail !== undefined && (
            <button type="button" className="toast-close" onClick={onDismiss} aria-label="通知を閉じる">
              <X size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
