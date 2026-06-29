
export interface ISubscription {
  [key: string]: any
  // order: number
  // name: string
  // title: string
  // status: string
  // id: string
  // image: string
}

export interface SubscriptionApi extends Subscription {
  [key: string]: any
  // id: string,
  // createdAt: Date
  // updatedAt: Date
}

export interface SubscriptionForm extends Subscription { }

export type SubscriptionKeys = keyof SubscriptionForm;
