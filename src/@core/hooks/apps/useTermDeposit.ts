import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  clearAll,
  clearDetails,
  fetchTermDepositAccountsAction,
  fetchTermDepositDetailsAction
} from 'src/store/apps/term-deposit'

export const useTermDeposit = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { accounts, details, status, detailsStatus } = useSelector((state: RootState) => state.termDeposit)

  const getAccounts = (partyId: string) => dispatch(fetchTermDepositAccountsAction(partyId)).unwrap()

  const getDetails = (partyId: string, accountId: string) =>
    dispatch(fetchTermDepositDetailsAction({ partyId, accountId })).unwrap()

  return {
    accounts,
    details,
    status,
    detailsStatus,
    isLoading: status === 'pending',
    isDetailsLoading: detailsStatus === 'pending',
    getAccounts,
    getDetails,
    clearDetails: () => dispatch(clearDetails()),
    clearAll: () => dispatch(clearAll())
  }
}  