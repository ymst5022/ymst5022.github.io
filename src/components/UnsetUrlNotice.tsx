/** 公開URLが未設定のときに、QR やURLコピーの代わりに出す案内（設計 D3） */
export function UnsetUrlNotice() {
  return (
    <p className="unset-notice">
      公開URLが未設定です。<code>src/data/profile.ts</code> の <code>siteUrl</code> に公開URLを書くと、QRコードとURLのコピーが使えるようになります。
    </p>
  )
}
