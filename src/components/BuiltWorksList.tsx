import type { BuiltWork } from '../data/types.ts'
import { hasText, nonEmpty, visibleWorks } from '../lib/links.ts'

interface Props {
  works: BuiltWork[]
}

/** これまでに作ったもの。画像もリンクも出さず、名前・説明・技術だけの箇条書きにする（決定 0007） */
export function BuiltWorksList({ works }: Props) {
  const visible = visibleWorks(works)
  if (visible.length === 0) return null

  return (
    <section className="section" aria-labelledby="built-title">
      <h2 id="built-title" className="section-title">
        作ってきたもの
      </h2>
      <ul className="built-list">
        {visible.map((work) => {
          const tech = nonEmpty(work.tech)
          return (
            <li key={work.name}>
              <h3 className="built-name">{work.name}</h3>
              {hasText(work.summary) && <p>{work.summary}</p>}
              {tech.length > 0 && (
                <ul className="tags tags-small" aria-label="使用技術">
                  {tech.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
