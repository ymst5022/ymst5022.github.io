// GitHub・X・Discord のロゴ。Lucide v1 にはブランドロゴが無いので simple-icons から取る（設計 D11）
import { siDiscord, siGithub, siX } from 'simple-icons'

const BRANDS = { github: siGithub, x: siX, discord: siDiscord }

export type Brand = keyof typeof BRANDS

interface Props {
  brand: Brand
  size?: number
}

export function BrandIcon({ brand, size = 20 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d={BRANDS[brand].path} />
    </svg>
  )
}
