import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { clearAll, fetchRecentTransactionsAction } from 'src/store/apps/recent-transactions'
import { RecentTransactionItem, RecentTransactionView } from 'src/types/apps/recentTransactions'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// '20261021' -> '21-Oct-2026'. API abhi sirf date deti hai, time aaye to yahan add hoga
// (aur dateTime '21-Oct-2026, 11:42 AM' ki shakl me banega)
const formatApiDate = (dateString?: string) => {
  if (!dateString || dateString.length !== 8) return ''

  const year = dateString.slice(0, 4)
  const month = Number(dateString.slice(4, 6))
  const day = dateString.slice(6, 8)

  return `${day}-${MONTHS[month - 1] ?? ''}-${year}`
}

// "98,000.00" ya "98000.00" -> 98000
const toNumber = (value: string | number) => Number(String(value ?? '0').replace(/,/g, '')) || 0

// API ke item ko component ki Transaction shape me badalta hai
export const toTransactionView = (item: RecentTransactionItem): RecentTransactionView => {
  const isDebit = item.transactionType === 'D'

  return {
    id: `${item.externalReferenceId}-${item.subSequenceNumber}`,
    name: isDebit ? 'Debit' : 'Credit', // API me title nahi aata, isay yahan badal sakte hain
    remarks: item.remarks ?? '',
    amount: toNumber(item.amount?.amount),
    currency: item.amount?.currency ?? '',
    status: 'Success', // API me status nahi aata, ye posted transactions hain
    type: isDebit ? 'debit' : 'credit',
    dateTime: formatApiDate(item.postingDate?.dateString)
  }
}

export const useRecentTransactions = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { entities, status, error } = useSelector((state: RootState) => state.recentTransactions)

  // Order wahi jo API ne diya (newest first), front end par sort nahi karte
  const transactions = useMemo(() => entities.map(toTransactionView), [entities])

  const fetchRecentTransactions = (accountId: string) =>
    dispatch(fetchRecentTransactionsAction(accountId)).unwrap()

  return {
    transactions,
    status,
    error,
    isLoading: status === 'pending',
    fetchRecentTransactions,
    clearAll: () => dispatch(clearAll())
  }
}

export default useRecentTransactions
