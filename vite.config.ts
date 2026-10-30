import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { profile } from './src/data/profile.ts'

const DESCRIPTION_MAX_LENGTH = 120

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * profile.ts から title・description・OGP を index.html に入れる（設計 D13）。
 * Discord や X に URL を貼ったときに、名前と肩書きのカードが出る。
 */
function profileMeta(): Plugin {
  const title = profile.title.trim() ? `${profile.handle} | ${profile.title}` : profile.handle
  const firstParagraph = profile.bio.trim().split(/\n\s*\n/)[0]?.replace(/\s+/g, ' ') ?? ''
  const description =
    firstParagraph.length > DESCRIPTION_MAX_LENGTH
      ? `${firstParagraph.slice(0, DESCRIPTION_MAX_LENGTH - 1)}…`
      : firstParagraph

  const metaTags = [
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta property="og:type" content="profile" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    profile.siteUrl.trim() ? `<meta property="og:url" content="${escapeHtml(profile.siteUrl.trim())}" />` : '',
    `<meta name="twitter:card" content="summary" />`,
  ].filter((tag) => tag !== '')

  return {
    name: 'devcard-profile-meta',
    transformIndexHtml(html) {
      // 関数で渡すのは、値に $ が含まれていても特殊な置換パターンとして扱わせないため
      return html
        .replace(/<title>.*?<\/title>/, () => `<title>${escapeHtml(title)}</title>`)
        .replace('</head>', () => `  ${metaTags.join('\n    ')}\n  </head>`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // ユーザーサイト https://ymst5022.github.io/ に置くので、base は / のまま（設計 D14）
  base: '/',
  plugins: [react(), profileMeta()],
})
