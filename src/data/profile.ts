// 名刺の中身。内容を変えるときは、このファイルだけを編集する（設計 D5）。
// - 使わない項目は、行ごと消すか空文字にすると、画面にも連絡先ファイルにも出なくなる
// - 下書きの値には先頭に印が付いている。印が1つでも残っていると公開は止まる（npm run check:publish）
// - 公開リポジトリに載るので、公開してよい情報だけを書く（決定 0002）
import type { Profile } from './types.ts'

export const profile: Profile = {
  siteUrl: 'https://ymst5022.github.io/',

  handle: 'やっこさん',
  title: '個人開発者（AI × 自動化）',
  bio: [
    'AIを使った情報収集やSNS発信の自動化、音声入力などの作業効率化ツールを個人で開発しています。',
    '',
    'AIに任せるところと、人が確かめるところをどう分けるか。AIを使うメリットとの向き合い方に興味があり、自分のツールで試しながら確かめています。',
    '',
    '「毎日くり返す作業を、仕組みで楽にする」ことが好きです。勉強会やDiscordで、気軽に声をかけてください。',
  ].join('\n'),

  interests: [
    '生成AI・LLMの活用',
    'SNS発信・動画編集の自動化',
    '音声入力',
    'スマホアプリ開発（天気予報・釣果記録など）',
    'TypeScript / React',
  ],

  // 取り組みは下の works に画像つきで載せるので、ここは空にしている（空なら出ない）
  currentFocus: [],

  links: {
    github: 'https://github.com/ymst5022',
    // x: 'https://x.com/<ユーザー名>',
    // blog: 'https://<ブログのURL>',
    // userId（数字のID）を足すと、プロフィールへのリンクも出る
    discord: { username: 'yakkosan' },
  },

  // 「取り組み」の欄。repoUrl か url があるとリンクが出る（非公開のものには書かない）。
  // 画像は public/works/ に置き、秘密や個人の情報が写っていないものだけを使う（決定 0006）
  works: [
    {
      name: '記事を選んでXに投稿する仕組み',
      status: '開発中',
      summary:
        'RSSで集めた記事をAIが採点し、スマホで「残す・削除」を選びます。残した記事に自分の感想を添えて、Xに投稿します。',
      tech: ['Python', 'FastAPI', 'SQLite', 'Gemini'],
      image: {
        src: '/works/article-curation.webp',
        alt: 'スマホの選別画面。AIの点数が付いた記事が並び、「削除」と「残す」のボタンがある',
        width: 780,
        height: 880,
      },
    },
    {
      name: 'キャラクターの掛け合い解説動画',
      status: '開発中',
      summary:
        '台本を書くだけで、VOICEVOXのキャラクターが掛け合いで解説する動画を作ります。声・字幕・スライドは自動で組み立てます。',
      tech: ['Remotion', 'React', 'TypeScript', 'VOICEVOX'],
      image: {
        src: '/works/dialogue-video.webp',
        alt: '動画の1場面。東北ずん子と東北きりたんが左右に立ち、字幕「ご視聴ありがとうございました。」が出ている',
        width: 1200,
        height: 376,
        credit: '立ち絵: 坂本アヒル',
      },
    },
  ],
}
