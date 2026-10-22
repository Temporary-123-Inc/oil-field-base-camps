import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const main = fs.readFileSync(path.join(root, 'src', 'main.tsx'), 'utf8')
const styles = fs.readFileSync(path.join(root, 'src', 'styles.css'), 'utf8')
const prerender = fs.readFileSync(path.join(root, 'scripts', 'prerender.mjs'), 'utf8')

describe('homepage primary family section', () => {
  it('renders immediately before the brief-to-basecamp process', () => {
    expect(main).toContain('<HomeFamilySection/><Process/>')
    expect(main).toContain('Remote Basecamp, Man Camp &amp; Workforce Housing')
  })

  it('links the homepage contextually to the Jacksonville, Texas city page', () => {
    expect(main).toContain('href="/texas/jacksonville-texas/"')
    expect(main).toContain('Jacksonville, Texas remote workforce housing basecamp trailer rentals')
    expect(prerender).toContain('href="/texas/jacksonville-texas/"')
  })

  it('mentions all nine facility families in readable copy', () => {
    const requiredFamilies = [
      'remote workforce housing',
      'sleeper/bunkhouse trailers',
      'mobile commercial kitchen trailers',
      'commercial dishwashing trailers',
      'refrigerated facilities',
      'shower and restroom combination trailers',
      'shower trailers',
      'restroom trailers',
      'laundry trailers',
    ]
    requiredFamilies.forEach(family => expect(main).toContain(family))
  })

  it('uses the requested long-tail rental language naturally', () => {
    for (const phrase of [
      'rental services',
      'temporary facilities',
      'trailer rentals',
      'trailers for rent',
      'trailer leasing',
      'temporary, modular or mobile infrastructure',
      'short-term or long-term operations',
      'industrial cleanup',
      'active construction',
      'facility renovation',
      'portable facility options',
      'emergency projects',
      'onsite plan',
    ]) expect(main).toContain(phrase)
  })

  it('provides a pause control and disables automatic motion when requested', () => {
    expect(main).toContain("paused?'Play photo gallery':'Pause photo gallery'")
    expect(main).toContain('[...inventory,...inventory]')
    expect(styles).toContain('@keyframes family-marquee')
    expect(styles).toContain('@media(prefers-reduced-motion:reduce){.family-marquee-track{animation:none')
  })
})
