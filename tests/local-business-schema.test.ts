import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const sourceHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8')

function schemas(html: string) {
  return [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)].map(match => JSON.parse(match[1]))
}

describe('GMB-matched LocalBusiness structured data', () => {
  it('publishes one stable LocalBusiness entity with the owner-supplied facts', () => {
    const localBusinesses = schemas(sourceHtml).filter(schema => schema['@type'] === 'LocalBusiness')
    expect(localBusinesses).toHaveLength(1)
    expect(localBusinesses[0]).toEqual(expect.objectContaining({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://oil-field-base-camps.com/#localbusiness',
      name: 'Oil Field Base Camp Rentals USA',
      alternateName: 'Oil Field Base Camps',
      url: 'https://oil-field-base-camps.com/',
      logo: 'https://oil-field-base-camps.com/images/oil-field-base-camps-shield-256.png',
      image: 'https://oil-field-base-camps.com/images/housing-480.webp',
      telephone: '+18883855965',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '1016 W Rusk St Unit 5',
        addressLocality: 'Jacksonville',
        addressRegion: 'TX',
        postalCode: '75766',
        addressCountry: 'US',
      },
      hasMap: 'https://maps.google.com/?cid=7538738209247297369',
      sameAs: ['https://maps.google.com/?cid=7538738209247297369'],
      openingHoursSpecification: expect.objectContaining({
        '@type': 'OpeningHoursSpecification',
        opens: '00:00',
        closes: '23:59',
      }),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: '4',
        bestRating: '5',
      },
    }))
  })

  it('does not retain a second standalone Organization entity', () => {
    const sourceSchemas = schemas(sourceHtml)
    expect(sourceSchemas.filter(schema => schema['@type'] === 'Organization')).toHaveLength(0)
    expect(sourceSchemas.filter(schema => schema['@type'] === 'LocalBusiness')).toHaveLength(1)
    expect(sourceHtml).toContain('AggregateRating')
    expect(sourceHtml).not.toContain('priceRange')
    expect(sourceHtml).toContain('openingHoursSpecification')
  })

  it('uses crawlable local assets that exist in the public build input', () => {
    expect(fs.existsSync(path.join(root, 'public', 'images', 'oil-field-base-camps-shield-256.png'))).toBe(true)
    expect(fs.existsSync(path.join(root, 'public', 'images', 'housing-480.webp'))).toBe(true)
  })
})
