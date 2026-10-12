import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from 'react'
import { ArrowRight, BedDouble, Check, Clock3, ExternalLink, MapPin, Phone, ShieldCheck, Truck, Users } from 'lucide-react'

type LinkProps = { href: string; children: ReactNode; className?: string }
type LocationProps = {
  path: string
  LinkComponent: ComponentType<LinkProps>
  leadForm: ReactNode
  emergencyBand: ReactNode
}

type Article = Record<string, unknown>
type CityRecord = {
  state: string
  representative_city: string
  delivery_time_range?: { display?: string }
  estimated_distance_range?: string
  city_discount_percent?: number | null
  nearby_service_area_data?: Array<{ label: string; slug: string }>
  page_layout_data: {
    slug: string
    title: string
    h1: string
    description: string
    breadcrumb_labels: string[]
    availability_label: string
    starting_price: number | string | null
    starting_price_basis?: string
    delivery_time_range?: { display?: string } | string
    estimated_delivery_display?: string
    delivery_distance?: string | { display?: string }
    service_hours?: string
    inventory_family?: string
    related_incident_articles?: Article[]
    nearby_service_areas?: string[]
    rental_information?: Record<string, string>
  }
}
type StateRecord = {
  state: string
  page_title: string
  h1: string
  description: string
  starting_price: number | string | null
}
type SiteData = {
  site_id: string
  company_profile: {
    positioning: string
    primary_cta: string
    primary_customer_types: string[]
    page_section_priorities: string[]
    supporting_content_topics: string[]
  }
  service_profile: {
    service_description: string
    target_customer_types: string[]
    prioritized_use_cases: string[]
    equipment: Record<string, string[]>
    preparation_plan: { before_delivery: string[]; additional_equipment_note: string }
    utilities_plan: Record<string, string>
    sanitation_plan: { before_delivery: string[]; confirmation_note: string }
    equipment_emphasis: string[]
    pricing: { pricing_basis: string }
    delivery: { typical_eta: string; availability_fallback: string }
  }
  inventory: {
    family_name: string
    family_definition: string
    inventory_status: string
    families: Array<{ id: string; name: string; items: string[] }>
  }
  rental_process: Array<{ step: number; title: string; description: string }>
  faqs: Array<{ question: string; answer: string }>
  location_data: { state_pages: StateRecord[] }
  service_area_data: CityRecord[]
}

const DATA_URL = '/data/site-38-remote-workforce-housing-basecamp.json'
const ORIGIN = 'https://oil-field-base-camps.com'
const TEXAS_OFFICE = {
  name: 'Oil Field Base Camp Rentals USA',
  addressLines: ['1016 W Rusk St Unit 5', 'Jacksonville, TX 75766', 'United States'],
  phoneDisplay: '1-888-385-5965',
  phoneE164: '+18883855965',
  mapsUrl: 'https://maps.app.goo.gl/MrEAT6YpegM3YnGZ6',
  reviewUrl: 'https://www.google.com/maps/place//@31.9598847,-95.2844851,17z/data=!3m1!4b1!4m3!3m2!1s0x86483dd35ef4dee5:0x689efa7598d97f59!12e1?entry=ttu&g_ep=EgoyMDI2MTAwNy4wIKXMDSoASAFQAw%3D%3D',
  embedUrl: 'https://www.google.com/maps?q=1016+W+Rusk+St+Unit+5,+Jacksonville,+TX+75766,+United+States&output=embed',
} as const
const heroImages = [
  ['/images/housing.webp', 'Remote workforce housing trailers arranged for a project basecamp'],
  ['/images/catalog/bunkhouse-trailers-960.webp', 'Sleeper and bunkbed trailer accommodation for a remote workforce'],
  ['/images/catalog/mobile-crew-camps-960.webp', 'Mobile crew camp facilities for project-based accommodation'],
] as const

function slugify(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function priceLabel(value: number | string | null | undefined) {
  if (typeof value === 'number') return `$${value.toLocaleString()}`
  return value || 'Project-specific quote'
}

function etaLabel(city: CityRecord) {
  const range = city.page_layout_data.delivery_time_range
  return (typeof range === 'object' ? range?.display : range) || city.delivery_time_range?.display || city.page_layout_data.estimated_delivery_display || 'Confirmed with quote'
}

function displayLabel(value: string | { display?: string } | null | undefined) {
  return typeof value === 'object' ? value?.display || 'Confirmed with quote' : value || 'Confirmed with quote'
}

function useLocationData() {
  const [data, setData] = useState<SiteData | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    fetch(DATA_URL, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`Location data returned ${response.status}`)
        return response.json()
      })
      .then(setData)
      .catch(error => { if (error.name !== 'AbortError') setFailed(true) })
    return () => controller.abort()
  }, [])
  return { data, failed }
}

function Breadcrumbs({ labels, stateSlug, LinkComponent }: { labels: string[]; stateSlug: string; LinkComponent: ComponentType<LinkProps> }) {
  const hrefs = ['/', '/service-areas/', `/service-areas/${stateSlug}/`]
  return <nav className="breadcrumbs" aria-label="Breadcrumb"><ol>{labels.map((label, index) => <li key={`${label}-${index}`}>{index < labels.length - 1 ? <LinkComponent href={hrefs[index] || '#'}>{label}</LinkComponent> : <span aria-current="page">{label}</span>}</li>)}</ol></nav>
}

function HeroMedia() {
  return <div className="location-media" aria-label="Remote workforce housing inventory gallery">{heroImages.map(([src, alt], index) => <figure className={index === 0 ? 'media-primary' : ''} key={src}><img src={src} alt={alt} width={index === 0 ? 1600 : 960} height={index === 0 ? 920 : 640} loading={index === 0 ? 'eager' : 'lazy'}/></figure>)}</div>
}

function HeroFacts({ availability, price, eta, distance }: { availability: string; price: string; eta: string; distance?: string }) {
  return <div className="location-facts">
    <div><ShieldCheck/><small>Availability</small><strong>{availability}</strong></div>
    <div><Users/><small>Starting price</small><strong>{price}</strong></div>
    <div><Clock3/><small>Planning ETA</small><strong>{eta}</strong></div>
    {distance && <div><Truck/><small>Delivery distance</small><strong>{distance}</strong></div>}
  </div>
}

function LocationHero({ variant, h1, description, availability, price, eta, distance, cta, LinkComponent }: { variant: number; h1: string; description: string; availability: string; price: string; eta: string; distance?: string; cta: string; LinkComponent: ComponentType<LinkProps> }) {
  const facts = <HeroFacts availability={availability} price={price} eta={eta} distance={distance}/>
  const action = <LinkComponent className="button" href="/contact-us/">{cta} <ArrowRight/></LinkComponent>
  return <section className={`location-hero hero-variation-${variant}`}>
    {variant === 2 && <HeroMedia/>}
    <div className="location-hero-copy"><span className="kicker">REMOTE WORKFORCE HOUSING</span><h1>{h1}</h1>{action}{variant === 3 && <span className="availability-pill">{availability}</span>}</div>
    {variant === 1 && facts}
    {variant === 1 && <HeroMedia/>}
    {variant === 2 && <div className="hero-compact-row">{facts}</div>}
    {variant === 3 && facts}
    {variant === 3 && <HeroMedia/>}
    {variant === 4 && <aside className="hero-info-panel">{facts}</aside>}
    {variant === 4 && <HeroMedia/>}
    <p className="location-hero-description">{description}</p>
  </section>
}

function StateGrid({ states, LinkComponent }: { states: StateRecord[]; LinkComponent: ComponentType<LinkProps> }) {
  return <section className="section state-directory"><div className="section-heading"><div><span className="kicker">NATIONWIDE SERVICE AREAS</span><h2>Choose a state.</h2></div><p>Each guide lists every city record assigned to that state in the authoritative site dataset.</p></div><div className="state-card-grid">{states.map(state => <LinkComponent href={`/service-areas/${slugify(state.state)}/`} key={state.state}><MapPin/><span><strong>{state.state}</strong><small>View locations</small></span><ArrowRight/></LinkComponent>)}</div></section>
}

function ServiceAreasHub({ data, LinkComponent }: { data: SiteData; LinkComponent: ComponentType<LinkProps> }) {
  return <><section className="location-hub-hero"><div><span className="kicker light">{data.company_profile.positioning.toUpperCase()}</span><h1>Remote Workforce Housing Service Areas</h1><p>{data.service_profile.service_description}</p><LinkComponent className="button" href="/contact-us/">{data.company_profile.primary_cta} <ArrowRight/></LinkComponent></div><HeroMedia/></section><StateGrid states={data.location_data.state_pages} LinkComponent={LinkComponent}/><ProjectFitModule data={data}/></>
}

function TexasOfficeSection() {
  return <section className="texas-office" aria-labelledby="texas-office-title">
    <div className="texas-office-details">
      <span className="kicker light">YOUR TEXAS RENTAL TEAM</span>
      <h2 id="texas-office-title">{TEXAS_OFFICE.name}</h2>
      <address>{TEXAS_OFFICE.addressLines.map(line => <span key={line}>{line}</span>)}</address>
      <a className="texas-office-phone" href={`tel:${TEXAS_OFFICE.phoneE164}`} aria-label={`Call ${TEXAS_OFFICE.name} at ${TEXAS_OFFICE.phoneDisplay}`}><Phone aria-hidden="true"/>{TEXAS_OFFICE.phoneDisplay}</a>
      <div className="texas-office-actions">
        <a className="texas-map-link" href={TEXAS_OFFICE.mapsUrl} target="_blank" rel="noopener noreferrer">View on Google Maps <ExternalLink aria-hidden="true"/></a>
        <a className="texas-review-link" href={TEXAS_OFFICE.reviewUrl} target="_blank" rel="noopener noreferrer">Review us on Google <ExternalLink aria-hidden="true"/></a>
      </div>
    </div>
    <div className="texas-office-map">
      <iframe title={`Map showing ${TEXAS_OFFICE.name} in Jacksonville, Texas`} src={TEXAS_OFFICE.embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/>
    </div>
  </section>
}

function StatePage({ state, cities, index, data, LinkComponent, leadForm }: { state: StateRecord; cities: CityRecord[]; index: number; data: SiteData; LinkComponent: ComponentType<LinkProps>; leadForm: ReactNode }) {
  const stateSlug = slugify(state.state)
  return <>
    <Breadcrumbs labels={['Home', 'Service Area Pages', state.state]} stateSlug={stateSlug} LinkComponent={LinkComponent}/>
    <LocationHero variant={(index % 4) + 1} h1={state.h1} description={state.description} availability={data.service_profile.delivery.availability_fallback} price={priceLabel(state.starting_price)} eta={data.service_profile.delivery.typical_eta} cta={data.company_profile.primary_cta} LinkComponent={LinkComponent}/>
    <section className="section city-directory"><div className="section-heading"><div><span className="kicker">CITIES SERVED IN {state.state.toUpperCase()}</span><h2>{cities.length} service areas.</h2></div><p>{data.inventory.family_definition}</p></div><div className="city-card-grid">{cities.map(city => <LinkComponent href={`/${stateSlug}/${city.page_layout_data.slug}/`} key={city.page_layout_data.slug}><MapPin/><span><strong>{city.representative_city}, {city.state}</strong><small>{city.page_layout_data.availability_label} • {etaLabel(city)}</small></span><ArrowRight/></LinkComponent>)}</div></section>
    <section className="section location-service-summary"><div><span className="kicker">RELEVANT SERVICE INFORMATION</span><h2>{data.inventory.family_name}</h2><p>{data.inventory.inventory_status}</p></div><div className="source-backed-summary"><article><Users/><small>Pricing basis</small><p>{data.service_profile.pricing.pricing_basis}</p></article><article><Truck/><small>Deployment timing</small><p>{data.service_profile.delivery.typical_eta}</p></article><article><ShieldCheck/><small>Availability</small><p>{data.service_profile.delivery.availability_fallback}</p></article></div></section>
    <ProjectFitModule data={data}/>
    {state.state === 'Texas' && <TexasOfficeSection/>}
    <section className="location-contact"><div><span className="kicker">PLAN A {state.state.toUpperCase()} BASECAMP</span><h2>Match accommodation to crew, site and schedule.</h2><p>{data.service_profile.pricing.pricing_basis}</p></div>{leadForm}</section>
  </>
}

function InventoryModule({ data }: { data: SiteData }) {
  return <section className="section"><div className="section-heading"><div><span className="kicker">ACCOMMODATION + SUPPORT</span><h2>{data.inventory.family_name}</h2></div><p>{data.inventory.family_definition}</p></div><div className="location-module-grid">{data.inventory.families.map((family, index) => <article key={family.id}><span>0{index + 1}</span><BedDouble/><h3>{family.name}</h3><ul>{family.items.map(item => <li key={item}><Check/>{item}</li>)}</ul></article>)}</div></section>
}

function ProjectFitModule({ data }: { data: SiteData }) {
  const customers = data.service_profile.target_customer_types.length ? data.service_profile.target_customer_types : data.company_profile.primary_customer_types
  return <section className="section project-fit"><div><span className="kicker">PROJECT FIT</span><h2>{data.company_profile.positioning}</h2><p>{data.service_profile.service_description}</p></div><div><article><h3>Customer types</h3><ul>{customers.map(item => <li key={item}><Check/>{item}</li>)}</ul></article><article><h3>Prioritized use cases</h3><ul>{data.service_profile.prioritized_use_cases.map(item => <li key={item}><Check/>{item}</li>)}</ul></article><article><h3>Supporting planning topics</h3><ul>{data.company_profile.supporting_content_topics.map(item => <li key={item}><Check/>{item}</li>)}</ul></article></div></section>
}

function ArticleModule({ articles }: { articles: Article[] }) {
  if (!articles.length) return null
  return <section className="section article-context"><span className="kicker">ASSIGNED INCIDENT CONTEXT</span><h2>Related project context</h2>{articles.map((article, index) => {
    const title = String(article.title || article.headline || 'Related incident article')
    const date = String(article.date || article.published_date || '')
    const url = String(article.source_url || article.url || article.link || '')
    return <article key={`${title}-${index}`}><h3>{title}</h3>{date && <time>{date}</time>}{url && <a href={url} rel="noopener noreferrer" target="_blank">View source <ArrowRight/></a>}</article>
  })}</section>
}

function CityPage({ city, index, data, LinkComponent, leadForm }: { city: CityRecord; index: number; data: SiteData; LinkComponent: ComponentType<LinkProps>; leadForm: ReactNode }) {
  const page = city.page_layout_data
  const stateSlug = slugify(city.state)
  const nearby = city.nearby_service_area_data || []
  const rentalInfo = Object.entries(page.rental_information || {})
  const articles = page.related_incident_articles || []
  const planningModules = [
    { id: 'sleeping_accommodation', content: <article><span className="kicker">PREPARATION + DELIVERY</span><h2>Prepare the site before dispatch.</h2>{data.service_profile.preparation_plan.before_delivery.map(item => <p key={item}>{item}</p>)}<p>{data.service_profile.preparation_plan.additional_equipment_note}</p></article> },
    { id: 'utilities', content: <article><span className="kicker">UTILITIES + CONNECTIONS</span><h2>Confirm the operating dependencies.</h2>{Object.entries(data.service_profile.utilities_plan).map(([key, value]) => key !== 'confirmation_note' && <p key={key}><strong>{key.replaceAll('_', ' ')}.</strong> {value}</p>)}</article> },
    { id: 'sanitation', content: <article><span className="kicker">SANITATION PLAN</span><h2>Define cleaning and service responsibilities.</h2>{data.service_profile.sanitation_plan.before_delivery.map(item => <p key={item}>{item}</p>)}<p>{data.service_profile.sanitation_plan.confirmation_note}</p></article> },
  ].sort((a, b) => {
    const rank = (id: string) => { const value = data.service_profile.equipment_emphasis.indexOf(id); return value < 0 ? 99 : value }
    return rank(a.id) - rank(b.id)
  })
  return <>
    <Breadcrumbs labels={page.breadcrumb_labels} stateSlug={stateSlug} LinkComponent={LinkComponent}/>
    <LocationHero variant={(index % 4) + 1} h1={page.h1} description={page.description} availability={page.availability_label} price={priceLabel(page.starting_price)} eta={etaLabel(city)} distance={displayLabel(page.delivery_distance)} cta={data.company_profile.primary_cta} LinkComponent={LinkComponent}/>
    <section className="location-data-strip"><span><Clock3/><b>Service hours</b>{page.service_hours}</span><span><Truck/><b>Estimated delivery</b>{page.estimated_delivery_display}</span><span><MapPin/><b>Delivery distance</b>{displayLabel(page.delivery_distance)}</span><span><BedDouble/><b>Inventory family</b>{page.inventory_family}</span></section>
    <InventoryModule data={data}/>
    <ProjectFitModule data={data}/>
    <section className="section planning-sections">{planningModules.map(module => <div className="planning-module" data-emphasis={module.id} key={module.id}>{module.content}</div>)}</section>
    <section className="process location-process"><div className="section-heading light"><div><span className="kicker light">RENTAL PROCESS</span><h2>From requirements to demobilization.</h2></div><p>{data.company_profile.page_section_priorities.join(' • ')}</p></div><ol>{data.rental_process.map(step => <li key={step.step}><b>0{step.step}</b><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol></section>
    <section className="section rental-information"><div><span className="kicker">PRICING + RENTAL TERMS</span><h2>{priceLabel(page.starting_price)}</h2><p>{page.starting_price_basis || data.service_profile.pricing.pricing_basis}</p>{city.city_discount_percent != null && <p><strong>Location adjustment:</strong> {city.city_discount_percent}% as provided for this city.</p>}</div><dl>{rentalInfo.map(([key, value]) => <div key={key}><dt>{key.replaceAll('_', ' ')}</dt><dd>{value}</dd></div>)}</dl></section>
    <ArticleModule articles={articles}/>
    {nearby.length > 0 && <section className="section nearby-areas"><div className="section-heading"><div><span className="kicker">NEARBY SERVICE AREAS</span><h2>Continue planning nearby.</h2></div><p>Links follow the location assignments in the site dataset.</p></div><div className="city-card-grid">{nearby.map(area => <LinkComponent href={`/${stateSlug}/${area.slug}/`} key={area.slug}><MapPin/><span><strong>{area.label}</strong><small>Remote workforce housing service area</small></span><ArrowRight/></LinkComponent>)}</div></section>}
    <section className="section faq-section"><div><span className="kicker">FREQUENTLY ASKED QUESTIONS</span><h2>Plan with confirmed information.</h2></div><div>{data.faqs.map(faq => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section>
    {city.state === 'Texas' && <TexasOfficeSection/>}
    <section className="location-contact"><div><span className="kicker">REQUEST A {city.representative_city.toUpperCase()} QUOTE</span><h2>{data.company_profile.primary_cta}</h2><p>{data.service_profile.pricing.pricing_basis}</p></div>{leadForm}</section>
  </>
}

export default function LocationPages({ path, LinkComponent, leadForm, emergencyBand }: LocationProps) {
  const { data, failed } = useLocationData()
  const segments = useMemo(() => path.split('?')[0].split('/').filter(Boolean), [path])
  useEffect(() => {
    if (!data) return
    let title = 'Remote Workforce Housing Service Areas'
    if (segments[0] === 'service-areas' && segments[1]) title = data.location_data.state_pages.find(state => slugify(state.state) === segments[1])?.page_title || title
    if (segments.length === 2 && segments[0] !== 'service-areas') title = data.service_area_data.find(city => slugify(city.state) === segments[0] && city.page_layout_data.slug === segments[1])?.page_layout_data.title || title
    document.title = `${title} | Oil Field Base Camps`
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (canonical) canonical.href = ORIGIN + path
  }, [data, path, segments])

  if (failed) return <section className="location-loading"><h1>Service area information is temporarily unavailable.</h1><p>Please use the contact form or call the response line for project support.</p></section>
  if (!data) return <section className="location-loading" aria-live="polite"><p>Loading service area information…</p></section>
  if (segments.length === 1 && segments[0] === 'service-areas') return <>{<ServiceAreasHub data={data} LinkComponent={LinkComponent}/ >}{emergencyBand}</>
  if (segments.length === 2 && segments[0] === 'service-areas') {
    const stateIndex = data.location_data.state_pages.findIndex(state => slugify(state.state) === segments[1])
    if (stateIndex >= 0) {
      const state = data.location_data.state_pages[stateIndex]
      const cities = data.service_area_data.filter(city => city.state === state.state)
      return <>{<StatePage state={state} cities={cities} index={stateIndex} data={data} LinkComponent={LinkComponent} leadForm={leadForm}/ >}{emergencyBand}</>
    }
  }
  if (segments.length === 2) {
    const cityIndex = data.service_area_data.findIndex(city => slugify(city.state) === segments[0] && city.page_layout_data.slug === segments[1])
    if (cityIndex >= 0) return <>{<CityPage city={data.service_area_data[cityIndex]} index={cityIndex} data={data} LinkComponent={LinkComponent} leadForm={leadForm}/ >}{emergencyBand}</>
  }
  return <section className="location-loading"><h1>Service area not found.</h1><p>The requested route is not part of the authoritative location dataset.</p><LinkComponent className="button" href="/service-areas/">Browse service areas</LinkComponent></section>
}
