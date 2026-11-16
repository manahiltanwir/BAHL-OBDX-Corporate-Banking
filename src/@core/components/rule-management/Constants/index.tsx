import { RuleType } from 'src/@core/data/dummy-rules'
import { RuleTaskCategory } from 'src/types/apps/ruleManagement'

export const RULE_REVIEW_STORAGE_KEY = 'ruleReviewData'

export const colors = {
  green: '#15804f',
  greenHover: '#309a6a'
}

export const DEFAULT_CURRENCY  = 'PKR'

export const currencyOptions: { value: string; label: string }[] = [
  { value: 'PKR', label: 'PKR - Pakistani Rupee' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'MYR', label: 'MYR - Malaysian Ringgit' },
  { value: 'BHD', label: 'BHD - Bahraini Dinar' }
]
export const MENU_PROPS = {
  disablePortal: true,
  PaperProps: {
    style: { maxHeight: 300 }
  }
}

export const ruleTypeOptions: { value: RuleType; label: string }[] = [
  { value: 'Financial', label: 'Financial' },
  { value: 'NonFinancial', label: 'Non Financial' }
]

export const ruleTypeToCategory = (type: RuleType): RuleTaskCategory =>
  type === 'Financial' ? 'financial' : 'non-financial'