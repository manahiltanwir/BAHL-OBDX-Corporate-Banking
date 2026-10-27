import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { fetchBeneficiariesAction, createBeneficiaryAction, deleteBeneficiaryAction, fetchBeneficiaryTitleAction, clearAddReview } from 'src/store/apps/beneficiary'
import { CreateBeneficiaryPayload, AddBeneficiaryDraft } from 'src/types/apps/beneficiary'

const useBeneficiary = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { beneficiaries, addReview, status } = useSelector((state: RootState) => state.beneficiary)

  const fetchBeneficiaries = useCallback(
    (userId: string) => dispatch(fetchBeneficiariesAction({ userId })),
    [dispatch]
  )

  // const fetchBeneficiariesByPartyId = useCallback(
  //   (cnic: string) => dispatch(fetchBeneficiariesAction({ cnic })),
  //   [dispatch]
  // )

  const createBeneficiary = useCallback(
    (data: CreateBeneficiaryPayload) =>
    dispatch(createBeneficiaryAction({ data })).unwrap(),
    [dispatch]
  )

  const deleteBeneficiary = useCallback(
   (id: number) => dispatch(deleteBeneficiaryAction({ id })).unwrap(),
    [dispatch]
  )

  const resetAddReview = useCallback(() => dispatch(clearAddReview()), [dispatch])
  const fetchBeneficiaryTitle = useCallback(
  (data: AddBeneficiaryDraft) =>
    dispatch(fetchBeneficiaryTitleAction({ data })).unwrap(),
  [dispatch]
)

  return {
    beneficiaries,
    addReview,
    fetchBeneficiaryTitle,
    deleteBeneficiary,
    resetAddReview,
    status,
    isLoading: status === 'pending',
    fetchBeneficiaries,
    createBeneficiary
  }
}

export default useBeneficiary