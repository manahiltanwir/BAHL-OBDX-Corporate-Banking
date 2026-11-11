import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  fetchTransferFromAccountsAction,
  fetchTitleAction,
  confirmInternalTransferAction
} from 'src/store/apps/internal-fund-transfer'
import { TransferDraft, ReviewState } from 'src/types/apps/internalFundTrasnfer'

const useInternalFundTransfer = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { accounts, review, confirmation, status } =
useSelector((state: RootState) => state.internalFundTransfer)

  const fetchTransferFromAccounts = useCallback(
    (username: string) => dispatch(fetchTransferFromAccountsAction({username })),
    [dispatch]
  )

  const fetchTitle = useCallback(
    (data: TransferDraft) => dispatch(fetchTitleAction({ data })).unwrap(),
    [dispatch]
  )

  const confirmTransfer = useCallback(
    (data: ReviewState) => dispatch(confirmInternalTransferAction({data })).unwrap(),
    [dispatch]
  )

  return {
    accounts,
    review,
    confirmation,
    status,
    isLoading: status === 'pending',
    fetchTransferFromAccounts,
    fetchTitle,
    confirmTransfer
  }
}

export default useInternalFundTransfer