import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const data = JSON.parse(fs.readFileSync(path.join(root, 'public', 'data', 'site-38-remote-workforce-housing-basecamp.json'), 'utf8'))
const slugify = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

describe('authoritative location dataset', () => {
  it('maps every state and city to a unique production route', () => {
    expect(data.site_id).toBe('site-38')
    expect(data.location_data.state_pages).toHaveLength(50)
    expect(data.service_area_data).toHaveLength(247)
    const routes = data.service_area_data.map((city: any) => `/${slugify(city.state)}/${city.page_layout_data.slug}/`)
    expect(new Set(routes).size).toBe(routes.length)
    for (const state of data.location_data.state_pages) {
      expect(data.service_area_data.some((city: any) => city.state === state.state)).toBe(true)
    }
  })

  it('keeps the Jacksonville record tied to its verified local profile and quote-based logistics', () => {
    const city = data.service_area_data.find((entry: any) => entry.city_slug === 'jacksonville-texas')
    expect(city).toBeTruthy()
    expect(city.state).toBe('Texas')
    expect(city.page_layout_data.h1).toBe('Emergency Remote Workforce Housing Basecamp Trailer Rentals in Jacksonville, TX')
    expect(city.page_layout_data.meta_description).toBe('Emergency remote workforce housing and basecamp trailer rentals in Jacksonville, TX. Request 24/7 project review for crew lodging and support facilities.')
    expect(city.page_layout_data.meta_description.length).toBeLessThanOrEqual(155)
    expect(city.page_layout_data.delivery_time_range.display).toBe('Confirmed with project quote')
    expect(city.page_layout_data.delivery_distance.display).toBe('Confirmed with project quote')
    expect(city.local_business_profile.profile_url).toBe('https://maps.google.com/?cid=7538738209247297369')
    expect(city.local_business_profile.review_url).toBe('https://g.page/r/CVl_2Zh1-p5oEAE/review')
    expect(city.local_business_profile.hours_display).toBe('Open 24 hours, Monday–Sunday')
    expect(city.local_business_profile.category).toBe('Trailer rental service')
    expect(city.local_business_profile.rating_value).toBe(5)
    expect(city.local_business_profile.review_count).toBe(4)
    expect(city.local_business_profile.website_url).toBe('https://oil-field-base-camps.com/')
    expect(city.faqs).toHaveLength(5)
  })

  it('keeps city records internally consistent and placeholder-free', () => {
    const forbidden = /\[(?:CONFIRM COMPANY POLICY|DELIVERY POLICY|MINIMUM RENTAL|SERVICE HOURS|EMERGENCY ETA)[^\]]*\]/i
    expect(JSON.stringify(data)).not.toMatch(forbidden)
    for (const city of data.service_area_data) {
      const page = city.page_layout_data
      expect(page.breadcrumb_labels).toEqual(['Home', 'Service Area Pages', city.state, city.representative_city])
      expect(page.slug).toBe(city.city_slug)
      expect(page.h1).toContain(city.representative_city)
      expect(page.description).toContain(city.representative_city)
      expect(page.delivery_time_range).toEqual(city.delivery_time_range)
      expect(page.related_incident_articles ?? []).toEqual([])
    }
  })

  it('does not invent published pricing or automatic discounts', () => {
    expect(data.service_profile.pricing.starting_price).toBeNull()
    expect(data.service_profile.pricing.city_discount_policy.maximum_discount_percent).toBeNull()
    for (const city of data.service_area_data) {
      expect(city.page_layout_data.starting_price).toBeNull()
      expect(city.city_discount_percent).toBeNull()
    }
  })
})
