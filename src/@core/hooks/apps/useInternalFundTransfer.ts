import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  fetchTransferFromAccountsAction,
  fetchTitleAction,
  confirmInternalTransferAction,
  resetReview
} from 'src/store/apps/internal-fund-transfer'
import { TransferDraft, ReviewState } from 'src/types/apps/internalFundTrasnfer'
//import { fetchBeneficiariesAction } from 'src/store/apps/internal-fund-transfer'

const useInternalFundTransfer = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { accounts,  review, confirmation, status } = useSelector((state:
RootState) => state.internalFundTransfer)

  const fetchTransferFromAccounts = useCallback(
    (username: string) => dispatch(fetchTransferFromAccountsAction({ username })),
    [dispatch]
  )

  const fetchTitle = useCallback(
  (data: TransferDraft) => dispatch(fetchTitleAction({ data })).unwrap(),
  [dispatch]
)

const confirmTransfer = useCallback(
  (data: ReviewState) => dispatch(confirmInternalTransferAction({ data })).unwrap(),
  [dispatch]
)

const clearReview = useCallback(() => dispatch(resetReview()), [dispatch])

// const fetchBeneficiaries = useCallback(
//   (cnic: string) => dispatch(fetchBeneficiariesAction({ cnic })),
//   [dispatch]
// )

  return {
    accounts,
    //beneficiaries,
  //fetchBeneficiaries,
  review,
  confirmation,
  status,
  isLoading: status === 'pending',
  fetchTransferFromAccounts,
  fetchTitle,
  confirmTransfer,
  clearReview
  }
}

export default useInternalFundTransfer