type ShippingType = {
  line1: string
  postal_code: string
  city: string
  state: string
  country: string
}

export type IntentBody = {
  name?: string
  email?: string
  subscriptionId: string
  shipping?: ShippingType
}
