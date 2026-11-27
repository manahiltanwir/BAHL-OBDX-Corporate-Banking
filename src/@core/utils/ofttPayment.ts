// Country ki values code hain; API ko label (poora naam) jata hai
export const countryOptions = [
  { value: 'PK', label: 'Pakistan' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'US', label: 'United States' }
]

// TODO: har purpose ka asli purposeCode bharein (abhi sirf SUPP sample se pata tha)
export const purposeOptions = [
  { value: 'family-support', label: 'Family Maintenance / Support', code: 'FMS' },
  { value: 'education', label: 'Education', code: 'EDU' },
  { value: 'medical', label: 'Medical Treatment', code: 'MED' },
  { value: 'business', label: 'Business Payment', code: 'BUSS' },
  { value: 'gift', label: 'Gift', code: 'GIF' },
  { value: 'other', label: 'Other', code: 'OTH' }
]

export const relationshipOptions = [
  { value: 'brother', label: 'Brother' },
  { value: 'sister', label: 'Sister' },
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'friend', label: 'Friend' },
  { value: 'business-partner', label: 'Business Partner' },
  { value: 'other', label: 'Other' }
]

export const normalizeCountry = (value?: string | null) => {
  const v = (value ?? '').trim().toLowerCase()

  if (!v) return ''
  if (v === 'uk') return 'GB'

  const match = countryOptions.find(o => o.value.toLowerCase() === v || o.label.toLowerCase() === v)

  return match?.value ?? ''
}