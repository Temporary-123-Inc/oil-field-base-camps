import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  MANAGEMENT_BRAND,
  MANAGEMENT_BRAND_SENTENCE,
  withManagementBrand,
} from '../src/brandDescription'

const root = process.cwd()
const main = fs.readFileSync(path.join(root, 'src', 'main.tsx'), 'utf8')
const locations = fs.readFileSync(path.join(root, 'src', 'LocationPages.tsx'), 'utf8')
const prerender = fs.readFileSync(path.join(root, 'scripts', 'prerender.mjs'), 'utf8')

describe('sitewide below-H1 brand description', () => {
  it('uses the exact brand name in a grammatical sentence', () => {
    expect(MANAGEMENT_BRAND).toBe('Oil Field Base Camp Facilities and Management')
    expect(MANAGEMENT_BRAND_SENTENCE).toBe(
      'Oil Field Base Camp Facilities and Management coordinates workforce housing, support facilities, and site logistics for each project.',
    )
  })

  it('adds the sentence once and preserves the supplied description', () => {
    const description = 'Original location-specific description.'
    const branded = withManagementBrand(description)
    expect(branded).toBe(`${MANAGEMENT_BRAND_SENTENCE} ${description}`)
    expect(withManagementBrand(branded)).toBe(branded)
    expect(branded.match(new RegExp(MANAGEMENT_BRAND, 'g'))).toHaveLength(1)
  })

  it('covers every shared non-home public H1 template', () => {
    expect(main).toContain('<h1>{title}</h1><p>{withManagementBrand(text)}</p>')
    expect(locations).toContain('<p className="location-hero-description">{withManagementBrand(description)}</p>')
    expect(locations).toContain('<h1>Remote Workforce Housing Service Areas</h1><p>{withManagementBrand(data.service_profile.service_description)}</p>')
  })

  it('keeps raw prerendered location introductions aligned with the rendered app', () => {
    expect(prerender).toContain("const managementBrand = 'Oil Field Base Camp Facilities and Management'")
    expect(prerender.match(/escapeHtml\(brandedDescription\(/g)).toHaveLength(3)
  })
})
