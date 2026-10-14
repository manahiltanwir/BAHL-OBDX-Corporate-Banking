import { RuleType } from 'src/@core/data/dummy-rules'
import { RuleTaskCategory } from 'src/types/apps/ruleManagement'

export const ADMIN_DEFAULT_RULE_TYPE: RuleType = 'NonFinancial'

export const adminRuleTypeOptions: {
  value: RuleType
  label: string
  apiValue: 'NON_FINANCIAL' | 'MAINTENANCE'
  category: RuleTaskCategory
}[] = [
  { value: 'NonFinancial', label: 'Non Financial', apiValue: 'NON_FINANCIAL', category: 'non-financial' },
  { value: 'Maintenance', label: 'Maintenance', apiValue: 'MAINTENANCE', category: 'maintenance' }
]

export const adminRuleTypeToApi = (v: RuleType) =>
  adminRuleTypeOptions.find(o => o.value === v)?.apiValue ?? 'NON_FINANCIAL'

export const adminApiToRuleType = (v: string): RuleType =>
  adminRuleTypeOptions.find(o => o.apiValue === v)?.value ?? ADMIN_DEFAULT_RULE_TYPE

export const adminRuleTypeToCategory = (v: RuleType): RuleTaskCategory =>
  adminRuleTypeOptions.find(o => o.value === v)?.category ?? 'non-financial'

export const adminRuleTypeLabel = (v: RuleType) => adminRuleTypeOptions.find(o => o.value === v)?.label ?? v