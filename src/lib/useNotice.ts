// 画面下の通知の状態（設計 D10）。成功は数秒で消し、失敗は閉じるまで残す
import { useCallback, useEffect, useState } from 'react'

export interface Notice {
  id: number
  message: string
  /** 失敗したときに、手でコピーできるよう表示する文字列 */
  detail?: string
}

const AUTO_HIDE_MS = 3000

export function useNotice() {
  const [notice, setNotice] = useState<Notice | null>(null)

  useEffect(() => {
    if (!notice || notice.detail !== undefined) return
    const timer = setTimeout(() => setNotice(null), AUTO_HIDE_MS)
    return () => clearTimeout(timer)
  }, [notice])

  const notify = useCallback((message: string, detail?: string) => {
    setNotice({ id: Date.now(), message, detail })
  }, [])

  const clear = useCallback(() => setNotice(null), [])

  return { notice, notify, clear }
}
