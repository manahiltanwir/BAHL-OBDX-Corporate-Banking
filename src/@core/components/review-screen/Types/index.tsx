export type ReviewFieldData = { label: string; value: string }
export type ReviewChipData = { label: string }
export type ReviewSectionData = {
  title: string
  fields: ReviewFieldData[]
  chips?: ReviewChipData[]
}