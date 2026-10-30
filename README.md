# DevCard

IT系の勉強会や交流イベントで使う、デジタル名刺のサイトです。
相手にスマホでQRコードを読み取ってもらうと、プロフィール・つながり先・制作物のページが開きます。

- 公開URL: https://ymst5022.github.io/
- 作り: React + TypeScript + Vite。GitHub Pages で公開し、GitHub Actions で自動公開します
- 設計: `docs/design/2026-10-29-devcard.md`、決めたことの記録: `docs/decisions/`

## 中身を変える

編集するのは `src/data/profile.ts` だけです。

- 使わない項目は、行ごと消すか空文字 `''` にすると、画面にも連絡先ファイルにも出なくなります
- 下書きの値には `TODO` と書いてあります。1つでも残っていると、公開は自動で止まります
- このリポジトリは公開されます。公開してよい情報だけを書いてください（本名・メール・住所・電話は書かない）

| やりたいこと | 書き換える場所 |
|---|---|
| X やブログを載せる | `links` の `x:` / `blog:` の行の `//` を消して、URLを書く |
| Discord を載せる | `links` の `discord:` の行。`userId`（数字のID）を書くと、プロフィールへのリンクも出る |
| 取り組みを足す | `works` に `{ name, status, summary, tech, repoUrl, url, image }` を1つ足す。非公開のものは `repoUrl`・`url` を書かない |
| 取り組みに画面の画像を付ける | 画像を `public/works/` に置き、`image: { src: '/works/xxx.webp', alt, width, height, credit }` を書く。1枚 200KB 以下にし、鍵・合言葉・メール・アカウント名・他人の投稿など、載せたくない情報が写っていないことを確かめる |
| 作ってきたものを足す | `builtWorks` に `{ name, summary, tech }` を1つ足す。画像とリンクは付けない（箇条書きで出る） |
| アバターを画像にする | 画像を `public/avatar.png` に置き、`avatarImage: '/avatar.png'` を足す（写真は位置情報などを消してから） |
| アクセント色を変える | `src/index.css` の一番上の `--accent` |

## 手元で動かす

1. `npm install`（最初の1回だけ）
2. `npm run dev`
3. 表示された `http://localhost:5173/` をブラウザで開く

## チェック

| コマンド | 何をするか |
|---|---|
| `npm run lint` | コードの書き方の検査（oxlint） |
| `npm run typecheck` | 型の検査 |
| `npm test` | 自動テスト（vCard・リンク・QR・コピー・取り組みのカード・作ってきたもの） |
| `npm run build` | 公開用のファイルを `dist/` に作る（型の検査を含む） |
| `npm run check:publish` | `profile.ts` に `TODO` が残っていないか、画像が `public/` にあって 200KB 以下かの検査 |

## 公開の手順（最初の1回）

どの手順も、外に公開される操作です。内容が確定し、`npm run check:publish` が成功してから行います。

1. GitHub で、名前が `ymst5022.github.io` の **Public** リポジトリを作る（README などは追加しない）
2. このフォルダで、コミットの作者メールが noreply アドレスになっていることを確かめる: `git config user.email`
3. コミットして push する: `git add -A` → `git commit -m "DevCard を公開"` → `git remote add origin https://github.com/ymst5022/ymst5022.github.io.git` → `git push -u origin main`
4. GitHub のリポジトリで **Settings → Pages → Build and deployment → Source** を **GitHub Actions** にする
5. **Actions** タブで「Deploy to GitHub Pages」が緑のチェックになるのを待つ（失敗したら、もう一度実行する）

2回目からは、main に push するだけで自動で公開されます。

## 公開後の確認（スマホで）

- [ ] Actions の「Deploy to GitHub Pages」が成功している
- [ ] スマホのカメラで「QRを表示」のQRを読み取ると、https://ymst5022.github.io/ が開く
- [ ] 「連絡先を保存」で連絡先アプリに登録でき、日本語が文字化けしない（iPhone と Android の両方があれば両方）
- [ ] 「画像を保存」で、QR画像を写真に保存できる（iPhone は画像の長押しで保存できるかも確かめる）
- [ ] 保存したQR画像を別のスマホで読み取ると、公開ページが開く
- [ ] 「URLをコピー」と Discord の「コピー」で通知が出て、貼り付けられる
- [ ] GitHub・X・ブログ・Discord の各リンクが、それぞれ正しいページを開く
- [ ] 「取り組み」の画像を押すと、大きな画像が開く
- [ ] URL を Discord に貼ると、名前と肩書きのカードが出る
- [ ] 画面に `TODO` や仮の文章が残っていない

## 独自ドメインに移るとき

GitHub の **Settings → Pages → Custom domain** に独自ドメインを設定すると、`https://ymst5022.github.io/` へのアクセスは新しいドメインへ自動で転送されます。印刷済みのQRもそのまま使えます。
`src/data/profile.ts` の `siteUrl` も新しいURLに書き換えてください。
