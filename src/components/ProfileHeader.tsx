import type { Profile } from '../data/types.ts'
import { hasText, nonEmpty } from '../lib/links.ts'

interface Props {
  profile: Profile
}

/** 画像があれば画像、無ければ頭文字を丸い枠に入れる（設計 D19） */
function Avatar({ profile }: Props) {
  if (hasText(profile.avatarImage)) {
    return <img className="avatar" src={profile.avatarImage} alt="" width={72} height={72} />
  }
  const text = hasText(profile.avatarText) ? profile.avatarText : (Array.from(profile.handle.trim())[0] ?? '?')
  return (
    <div className="avatar" aria-hidden="true">
      {text}
    </div>
  )
}

export function ProfileHeader({ profile }: Props) {
  const paragraphs = profile.bio
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph !== '')
  const interests = nonEmpty(profile.interests)
  const focus = nonEmpty(profile.currentFocus)

  return (
    <section className="profile" aria-labelledby="profile-name">
      <div className="profile-head">
        <Avatar profile={profile} />
        <div className="profile-name-block">
          <h1 id="profile-name">{profile.handle}</h1>
          {hasText(profile.title) && <p className="profile-title">{profile.title}</p>}
        </div>
      </div>

      {paragraphs.map((paragraph, index) => (
        <p key={index} className="bio">
          {paragraph}
        </p>
      ))}

      {interests.length > 0 && (
        <div className="block">
          <h2 className="block-title">興味のある分野</h2>
          <ul className="tags">
            {interests.map((interest) => (
              <li key={interest}>{interest}</li>
            ))}
          </ul>
        </div>
      )}

      {focus.length > 0 && (
        <div className="block">
          <h2 className="block-title">いま取り組んでいること</h2>
          <ul className="focus-list">
            {focus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
