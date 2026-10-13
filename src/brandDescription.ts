export const MANAGEMENT_BRAND = 'Oil Field Base Camp Facilities and Management'

export const MANAGEMENT_BRAND_SENTENCE =
  `${MANAGEMENT_BRAND} coordinates workforce housing, support facilities, and site logistics for each project.`

export function withManagementBrand(description: string) {
  const normalized = description.trim()
  if (normalized.includes(MANAGEMENT_BRAND)) return normalized
  return `${MANAGEMENT_BRAND_SENTENCE} ${normalized}`.trim()
}
