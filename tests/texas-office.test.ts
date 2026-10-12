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
    expect(source).toContain('https://maps.app.goo.gl/MrEAT6YpegM3YnGZ6')
    expect(source).toContain('0x689efa7598d97f59')
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
