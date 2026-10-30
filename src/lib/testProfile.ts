// テスト用のプロフィール。実在しない値だけを使う
import type { Profile } from '../data/types.ts'

export function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    siteUrl: 'https://example.github.io/',
    handle: 'テスト太郎',
    title: '個人開発者',
    bio: '自己紹介',
    interests: [],
    currentFocus: [],
    links: {},
    works: [],
    builtWorks: [],
    ...overrides,
  }
}
