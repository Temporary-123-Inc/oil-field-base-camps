import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const source = fs.readFileSync(path.join(root, 'src', 'LocationPages.tsx'), 'utf8')
const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'))
const data = JSON.parse(fs.readFileSync(path.join(root, 'public', 'data', 'site-38-remote-workforce-housing-basecamp.json'), 'utf8'))

describe('Texas local office section', () => {
  it('uses the exact owner-supplied contact information and Google destinations', () => {
    expect(source).toContain('Oil Field Base Camp Rentals USA')
    expect(source).toContain('1016 W Rusk St Unit 5')
    expect(source).toContain('Jacksonville, TX 75766')
    expect(source).toContain("phoneE164: '+18883855965'")
    expect(source).toContain('https://maps.google.com/?cid=7538738209247297369')
    expect(source).toContain('https://g.page/r/CVl_2Zh1-p5oEAE/review')
    expect(source).toContain('Open 24 hours, Monday–Sunday')
    expect(source).toContain("category: 'Trailer rental service'")
    expect(source).toContain('ratingValue: 5.0')
    expect(source).toContain('reviewCount: 4')
    expect(source).toContain("websiteUrl: 'https://oil-field-base-camps.com/'")
  })

  it('renders only on the Texas state page and Texas city pages', () => {
    expect(source).toContain("state.state === 'Texas' && <TexasOfficeSection/>")
    expect(source).toContain("city.state === 'Texas' && <TexasOfficeSection/>")
    expect(data.service_area_data.filter((city: { state: string }) => city.state === 'Texas').length).toBeGreaterThan(0)
  })

  it('allows the embedded Google map through the production CSP', () => {
    const csp = vercel.headers[0].headers.find((header: { key: string }) => header.key === 'Content-Security-Policy').value
    expect(csp).toContain('frame-src https://www.google.com https://maps.google.com')
  })
})
