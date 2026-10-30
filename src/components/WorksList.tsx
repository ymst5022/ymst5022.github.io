import { Globe } from 'lucide-react'
import type { Work } from '../data/types.ts'
import { hasText, nonEmpty, visibleWorks } from '../lib/links.ts'
import { BrandIcon } from './BrandIcon.tsx'

interface Props {
  works: Work[]
}

/** 取り組みの紹介。名前の無いものは出さない（設計 D5、決定 0006） */
export function WorksList({ works }: Props) {
  const visible = visibleWorks(works)
  if (visible.length === 0) return null

  return (
    <section className="section" aria-labelledby="works-title">
      <h2 id="works-title" className="section-title">
        取り組み
      </h2>
      <ul className="works">
        {visible.map((work) => {
          const tech = nonEmpty(work.tech)
          return (
            <li key={work.name} className="work-card">
              {work.image && (
                <figure className="work-figure">
                  <a href={work.image.src} target="_blank" rel="noopener noreferrer" className="work-image-link">
                    <img
                      className="work-image"
                      src={work.image.src}
                      alt={work.image.alt}
                      width={work.image.width}
                      height={work.image.height}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="visually-hidden">（画像を新しいタブで大きく開きます）</span>
                  </a>
                  {hasText(work.image.credit) && <figcaption className="work-credit">{work.image.credit}</figcaption>}
                </figure>
              )}
              <h3 className="work-title">
                {work.name}
                {hasText(work.status) && <span className="work-status">{work.status}</span>}
              </h3>
              {hasText(work.summary) && <p>{work.summary}</p>}
              {tech.length > 0 && (
                <ul className="tags tags-small" aria-label="使用技術">
                  {tech.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              )}
              {(hasText(work.repoUrl) || hasText(work.url)) && (
                <div className="work-links">
                  {hasText(work.repoUrl) && (
                    <a href={work.repoUrl} target="_blank" rel="noopener noreferrer">
                      <BrandIcon brand="github" size={18} />
                      GitHub
                      <span className="visually-hidden">（新しいタブで開きます）</span>
                    </a>
                  )}
                  {hasText(work.url) && (
                    <a href={work.url} target="_blank" rel="noopener noreferrer">
                      <Globe size={18} aria-hidden="true" />
                      公開ページ
                      <span className="visually-hidden">（新しいタブで開きます）</span>
                    </a>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
