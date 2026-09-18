import { RuleType } from 'src/@core/data/dummy-rules'
import { RuleTaskCategory } from 'src/types/apps/ruleManagement'

export const RULE_REVIEW_STORAGE_KEY = 'ruleReviewData'

export const colors = {
  green: '#15804f',
  greenHover: '#309a6a'
}

// CURRENCY KO FIELD MEIN LENA HAI AMOUNT KE SATH
export const CURRENCY = 'PKR'

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