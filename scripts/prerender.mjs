import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const dist = path.join(root, 'dist')
const source = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const data = JSON.parse(fs.readFileSync(path.join(root, 'public', 'data', 'site-38-remote-workforce-housing-basecamp.json'), 'utf8'))
const origin = 'https://oil-field-base-camps.com'

const inventory = [
  ['mobile-commercial-kitchens', 'Mobile Commercial Kitchen Trailer Rentals'],
  ['commercial-dishwashing', 'Portable Commercial Dishwashing Trailer Rentals'],
  ['refrigerated-facilities', 'Portable Refrigerated Trailer Rentals'],
  ['shower-restroom-combinations', 'Portable Shower Restroom Trailer Rentals'],
  ['shower-trailers', 'Portable Shower Trailer Rentals'],
  ['restroom-trailers', 'Portable Restroom Trailer Rentals'],
  ['laundry-trailers', 'Mobile Laundry Trailer Rentals'],
  ['sleeper-bunkbed-trailers', 'Portable Sleeper Bunkbed Trailer Rentals'],
  ['remote-workforce-housing', 'Remote Workforce Housing Basecamp Trailer Rentals'],
]

const escapeHtml = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;')
const slugify = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const priceLabel = value => typeof value === 'number' ? `$${value.toLocaleString()}` : value || 'Project-specific quote'
const displayLabel = value => typeof value === 'object' ? value?.display || 'Confirmed with quote' : value || 'Confirmed with quote'
const etaLabel = city => {
  const range = city.page_layout_data.delivery_time_range
  return (typeof range === 'object' ? range?.display : range) || city.delivery_time_range?.display || city.page_layout_data.estimated_delivery_display || 'Confirmed with quote'
}

const routes = [
  ['/', 'Remote Workforce Housing Basecamp Trailer Rentals', 'Plan mancamps, remote workforce housing, bunkbed accommodations and nine coordinated basecamp facility families.', ''],
  ...inventory.map(([slug, title]) => [`/inventory/${slug}/`, title, `${title} for remote workforce housing, industrial projects and temporary basecamp operations.`, '']),
  ['/industries/', 'Remote Workforce Housing for Demanding Operations', 'Temporary basecamp support for oil and gas, mining, construction, government and emergency projects.', ''],
  ['/how-it-works/', 'Plan a Remote Man Camp Basecamp Rental', 'Prepare crew, site, utility and schedule requirements for a remote basecamp deployment.', ''],
  ['/rental-calculator/', 'Remote Workforce Housing Basecamp Rental Calculator', 'Create a preliminary facility mix from crew size, duration and operational scope.', ''],
  ['/about-us/', 'About Oil Field Base Camps', 'Coordinate remote accommodation, hygiene, food service, refrigeration and laundry facilities.', ''],
  ['/contact-us/', 'Request Remote Workforce Housing Basecamp Rentals', 'Send project location, dates, crew count and facility needs for review.', ''],
  ['/privacy/', 'Privacy Notice', 'Learn how Oil Field Base Camps handles project inquiry information.', ''],
]

const citiesByState = new Map()
for (const city of data.service_area_data) {
  if (!citiesByState.has(city.state)) citiesByState.set(city.state, [])
  citiesByState.get(city.state).push(city)
}

const hubBody = `<div class="static-location-shell"><main><h1>Remote Workforce Housing Service Areas</h1><p>${escapeHtml(data.service_profile.service_description)}</p><ul>${data.location_data.state_pages.map(state => `<li><a href="/service-areas/${slugify(state.state)}/">${escapeHtml(state.state)} remote workforce housing service areas</a></li>`).join('')}</ul></main></div>`
routes.push(['/service-areas/', 'Remote Workforce Housing Service Areas', data.service_profile.service_description, hubBody])

for (const state of data.location_data.state_pages) {
  const stateSlug = slugify(state.state)
  const cities = citiesByState.get(state.state) || []
  const body = `<div class="static-location-shell"><nav aria-label="Breadcrumb"><a href="/">Home</a> → <a href="/service-areas/">Service Area Pages</a> → <span>${escapeHtml(state.state)}</span></nav><main><h1>${escapeHtml(state.h1)}</h1><p>${escapeHtml(state.description)}</p><p><strong>Starting price:</strong> ${escapeHtml(priceLabel(state.starting_price))}</p><h2>Cities served in ${escapeHtml(state.state)}</h2><ul>${cities.map(city => `<li><a href="/${stateSlug}/${escapeHtml(city.page_layout_data.slug)}/">${escapeHtml(city.representative_city)}, ${escapeHtml(city.state)}</a></li>`).join('')}</ul></main></div>`
  routes.push([`/service-areas/${stateSlug}/`, state.page_title, state.description, body])
}

for (const city of data.service_area_data) {
  const page = city.page_layout_data
  const stateSlug = slugify(city.state)
  const labels = page.breadcrumb_labels
  const articles = page.related_incident_articles || []
  const nearby = city.nearby_service_area_data || []
  const body = `<div class="static-location-shell"><nav aria-label="Breadcrumb"><a href="/">${escapeHtml(labels[0])}</a> → <a href="/service-areas/">${escapeHtml(labels[1])}</a> → <a href="/service-areas/${stateSlug}/">${escapeHtml(labels[2])}</a> → <span>${escapeHtml(labels[3])}</span></nav><main><h1>${escapeHtml(page.h1)}</h1><p>${escapeHtml(page.description)}</p><dl><dt>Availability</dt><dd>${escapeHtml(page.availability_label)}</dd><dt>Starting price</dt><dd>${escapeHtml(priceLabel(page.starting_price))}</dd><dt>Delivery/ETA range</dt><dd>${escapeHtml(etaLabel(city))}</dd><dt>Estimated delivery</dt><dd>${escapeHtml(page.estimated_delivery_display)}</dd><dt>Delivery distance</dt><dd>${escapeHtml(displayLabel(page.delivery_distance))}</dd><dt>Service hours</dt><dd>${escapeHtml(page.service_hours)}</dd><dt>Inventory family</dt><dd>${escapeHtml(page.inventory_family)}</dd></dl>${articles.length ? `<h2>Related incident context</h2>${articles.map(article => `<article><h3>${escapeHtml(article.title || article.headline || 'Related incident article')}</h3>${article.date || article.published_date ? `<time>${escapeHtml(article.date || article.published_date)}</time>` : ''}${article.source_url || article.url || article.link ? `<a href="${escapeHtml(article.source_url || article.url || article.link)}">View source</a>` : ''}</article>`).join('')}` : ''}${nearby.length ? `<h2>Nearby service areas</h2><ul>${nearby.map(area => `<li><a href="/${stateSlug}/${escapeHtml(area.slug)}/">${escapeHtml(area.label)}</a></li>`).join('')}</ul>` : ''}</main></div>`
  routes.push([`/${stateSlug}/${page.slug}/`, page.title, page.description, body])
}

const seen = new Set()
for (const [route, title, description, staticBody] of routes) {
  if (seen.has(route)) throw new Error(`Duplicate prerender route: ${route}`)
  seen.add(route)
  const html = source
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)} | Oil Field Base Camps</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(description)}"/>`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${origin}${route}"/>`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(title)}"/>`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${origin}${route}"/>`)
    .replace('<div id="root"></div>', `<div id="root">${staticBody}</div>`)
  const dir = route === '/' ? dist : path.join(dist, route)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html)
}

fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(([route]) => `  <url><loc>${origin}${route}</loc></url>`).join('\n')}\n</urlset>\n`)
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`)
console.log(`Prerendered ${routes.length} indexable routes (${data.location_data.state_pages.length} states, ${data.service_area_data.length} cities).`)
