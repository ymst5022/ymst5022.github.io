// 名刺に載せる情報の形（設計 D5）。値の入れ物は profile.ts。

export interface Profile {
  /** QRコードとURLコピーに使う公開URL。空文字なら「未設定」として案内を出す（D3） */
  siteUrl: string
  /** 表示名（ハンドルネーム）。vCard の FN / N にも使う（P11） */
  handle: string
  /** 文字アバターに出す文字。省略時は handle の1文字目（P12, D19） */
  avatarText?: string
  /** アバター画像のパス（例: "/avatar.png"、public/ に置く）。設定すると文字アバターの代わりに出す（D19） */
  avatarImage?: string
  /** 肩書き */
  title: string
  /** 自己紹介。空行で段落を分ける */
  bio: string
  /** 興味のある技術分野 */
  interests: string[]
  /** 今取り組んでいること */
  currentFocus: string[]
  links: Links
  works: Work[]
  /** これまでに作ったもの。画像もリンクも付けず、名前・説明・技術だけを箇条書きで出す */
  builtWorks: BuiltWork[]
}

export interface Links {
  /** 例: https://github.com/<ユーザー名> */
  github?: string
  /** 例: https://x.com/<ユーザー名> */
  x?: string
  /** 技術ブログのURL */
  blog?: string
  discord?: DiscordLink
  /** P9 により今は設定しない。必要になったら値を入れるだけで表示と vCard に出る */
  email?: string
}

export interface DiscordLink {
  /** 表示とコピーに使うユーザー名 */
  username: string
  /** 数字のユーザーID。あれば https://discord.com/users/<userId> へリンクする */
  userId?: string
}

export interface Work {
  /** 名称 */
  name: string
  /** 概要 */
  summary: string
  /** 使用技術 */
  tech: string[]
  /** GitHub リポジトリの URL */
  repoUrl?: string
  /** 公開している URL */
  url?: string
  /** 名前の横に出す印（例: "開発中"） */
  status?: string
  /** 画面の画像。非公開のものは、秘密や個人の情報が写っていない画像だけを載せる（決定 0006） */
  image?: WorkImage
}

/** 「作ってきたもの」の1項目。名称・概要・使用技術だけ */
export type BuiltWork = Pick<Work, 'name' | 'summary' | 'tech'>

export interface WorkImage {
  /** public/ に置いた画像のパス（例: "/works/xxx.webp"）。1枚 200KB 以下にする */
  src: string
  /** 画像の説明（読み上げ用） */
  alt: string
  /** 画像の実際の幅と高さ（読み込み中に画面がずれないように使う） */
  width: number
  height: number
  /** 画像の下に出すクレジット（例: "立ち絵: 坂本アヒル"） */
  credit?: string
}
