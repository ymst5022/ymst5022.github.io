import { QrCode } from 'lucide-react'
import { useCallback, useState } from 'react'
import { BuiltWorksList } from './components/BuiltWorksList.tsx'
import { ConnectLinks } from './components/ConnectLinks.tsx'
import { ProfileHeader } from './components/ProfileHeader.tsx'
import { QrDialog } from './components/QrDialog.tsx'
import { ShareActions } from './components/ShareActions.tsx'
import { Toast } from './components/Toast.tsx'
import { WorksList } from './components/WorksList.tsx'
import { profile } from './data/profile.ts'
import { copyText } from './lib/copy.ts'
import { useNotice } from './lib/useNotice.ts'

/** 1ページだけの名刺。上から プロフィール → つながる → 取り組み → 作ってきたもの → 保存・共有（設計 D7、決定 0004） */
export default function App() {
  const [qrOpen, setQrOpen] = useState(false)
  const { notice, notify, clear } = useNotice()

  const handleCopy = useCallback(
    async (text: string, label: string) => {
      const result = await copyText(text, label)
      // 失敗したときは、手でコピーできるよう文字列も出す
      notify(result.message, result.ok ? undefined : text)
    },
    [notify],
  )

  return (
    <>
      <header className="topbar">
        <button type="button" className="button button-small" onClick={() => setQrOpen(true)}>
          <QrCode size={20} aria-hidden="true" />
          QRを表示
        </button>
      </header>

      <main className="page">
        <ProfileHeader profile={profile} />
        <ConnectLinks links={profile.links} onCopy={handleCopy} />
        <WorksList works={profile.works} />
        <BuiltWorksList works={profile.builtWorks} />
        <ShareActions profile={profile} onCopy={handleCopy} />
      </main>

      <QrDialog
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        siteUrl={profile.siteUrl}
        onCopy={handleCopy}
        notice={notice}
        onDismissNotice={clear}
      />
      <Toast notice={qrOpen ? null : notice} onDismiss={clear} />
    </>
  )
}
