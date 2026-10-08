import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const dist = path.join(root, 'dist')
const source = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const data = JSON.parse(fs.readFileSync(path.join(root, 'src/data/site-38.json'), 'utf8'))
const origin = 'https://custom-kitchen-hoods.com'
const slugify = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const staticRoutes = [
  ['/', 'Mobile Commercial Kitchen Trailer Rentals', 'Temporary commercial kitchen and refrigeration trailer rentals planned around your project site and operating workflow.'],
  ['/equipment-rental/', 'Commercial Kitchen and Refrigeration Trailer Rentals', 'Compare mobile kitchen, dishwashing, walk-in cooler, walk-in freezer, and refrigeration trailer rentals.'],
  ['/equipment-rental/mobile-kitchen-trailers/', 'Mobile Commercial Kitchen Trailer Rentals', 'Plan temporary cooking, preparation, ventilation, and service capacity.'],
  ['/equipment-rental/dishwashing-trailers/', 'Portable Commercial Dishwashing Trailer Rentals', 'Plan temporary commercial warewashing capacity for your site.'],
  ['/equipment-rental/walk-in-cooler-trailers/', 'Mobile Walk-In Cooler Trailer Rentals', 'Plan temporary chilled storage capacity for your project.'],
  ['/equipment-rental/walk-in-freezer-trailers/', 'Mobile Walk-In Freezer Trailer Rentals', 'Plan temporary frozen storage capacity for your project.'],
  ['/equipment-rental/refrigeration-trailers/', 'Temporary Commercial Refrigeration Trailer Rentals', 'Plan temporary refrigerated storage around your site, volume, and schedule.'],
  ['/industries/', 'Temporary Food-Service Project Industries', 'Mobile facilities for renovations, interruptions, events, construction, healthcare, education, and other projects.'],
  ['/service-areas/', 'Mobile Kitchen Trailer Rental Service Areas', 'Explore state planning pages for mobile kitchen and refrigeration trailer rentals.'],
  ['/planning/', 'Mobile Kitchen Trailer Project Planning', 'Prepare the site, utilities, workflow, and schedule for a temporary mobile kitchen facility.'],
  ['/rental-calculator/', 'Mobile Kitchen Rental Calculator', 'Create an early planning range for a temporary facility rental.'],
  ['/contact-us/', 'Request a Mobile Kitchen Trailer Plan', 'Share the location, dates, facility type, operating needs, and known site conditions.'],
  ['/privacy/', 'Privacy Notice', 'Learn how project request data is used.']
]
const stateRoutes = data.location_data.state_pages.map(s => [`/service-areas/${slugify(s.state)}/`, `${s.state} Mobile Commercial Kitchen Trailer Rentals`, `Plan temporary mobile kitchen, dishwashing, walk-in cooler, walk-in freezer, and refrigeration trailer rentals in ${s.state}.`])
const routes = [...staticRoutes, ...stateRoutes]
for (const [route, title, description] of routes) {
  const html = source
    .replace(/<title>.*?<\/title>/, `<title>${title} | Custom Kitchen Hoods</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${origin}${route}" />`)
  const dir = route === '/' ? dist : path.join(dist, route)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html)
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(([route]) => `  <url><loc>${origin}${route}</loc></url>`).join('\n')}\n</urlset>\n`
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap)
console.log(`Prerendered ${routes.length} indexable routes.`)
