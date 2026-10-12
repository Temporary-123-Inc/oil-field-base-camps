import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const origin = 'https://oil-field-base-camps.com'
const robots = fs.readFileSync(path.join(root, 'public', 'robots.txt'), 'utf8').replaceAll('\r\n', '\n')
const head = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
const prerender = fs.readFileSync(path.join(root, 'scripts', 'prerender.mjs'), 'utf8')
const data = JSON.parse(fs.readFileSync(path.join(root, 'public', 'data', 'site-38-remote-workforce-housing-basecamp.json'), 'utf8'))

describe('public indexing controls', () => {
  it('publishes the canonical robots policy and keeps APIs out of crawl inventory', () => {
    expect(robots).toBe(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`)
    expect(robots).not.toContain('custom-kitchen-hoods.com')
  })

  it('sets index,follow in the shared HTML head', () => {
    expect(head).toContain('<meta name="robots" content="index,follow"/>')
    expect(head).not.toMatch(/noindex|nofollow/i)
  })

  it('builds the complete intended public inventory without duplicates', () => {
    const fixedRoutes = 17 // home, nine inventory pages, six core pages, and the service-area hub
    const expected = fixedRoutes + data.location_data.state_pages.length + data.service_area_data.length
    expect(expected).toBe(313)
    expect(prerender).toContain("if (seen.has(route)) throw new Error(`Duplicate prerender route: ${route}`)")
    expect(prerender).toContain("if (new Set(sitemapUrls).size !== sitemapUrls.length) throw new Error('Sitemap contains duplicate canonical URLs')")
    expect(prerender).toContain('Disallow: /api/')
    expect(prerender).toContain('Indexing controls failed:')
  })
})
