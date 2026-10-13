import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const main = fs.readFileSync(path.join(process.cwd(), 'src', 'main.tsx'), 'utf8')

describe('owner-approved homepage hero copy', () => {
  it('removes Trailer from the homepage H1 only', () => {
    expect(main).toContain('<h1>Remote Workforce Housing Basecamp Rentals</h1>')
    expect(main).not.toContain('<h1>Remote Workforce Housing Basecamp Trailer Rentals</h1>')
  })

  it('uses the requested facility families with corrected grammar', () => {
    expect(main).toContain(
      'Remote workforce housing basecamp trailer rentals bring accommodation, shower trailers, shower-and-restroom combination trailers, food service, refrigeration, laundry, and sleeper/bunkbed trailer facilities into one coordinated plan.',
    )
    expect(main).toContain(
      'We help oil and gas, mining, construction, government, and emergency teams define crew counts, utilities, access, and deployment timing.',
    )
    expect(main).toContain(
      'Call our 24/7 response line or send the project brief to confirm configuration, availability, and delivery.',
    )
  })
})
