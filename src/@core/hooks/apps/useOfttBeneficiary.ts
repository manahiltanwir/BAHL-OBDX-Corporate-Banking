import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { clearAll, createOfttBeneficiaryAction } from 'src/store/apps/oftt-beneficiary'
import { toCreateOfttPayload } from 'src/services'
import { OfttBeneficiaryFormInput } from 'src/types/apps/ofttBeneficiary'

const useOfttBeneficiary = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { created, status } = useSelector((state: RootState) => state.ofttBeneficiary)

  const createBeneficiary = (input: OfttBeneficiaryFormInput) =>
    dispatch(createOfttBeneficiaryAction(toCreateOfttPayload(input))).unwrap()

  return {
    created,
    status,
    isLoading: status === 'pending',
    createBeneficiary,
    clearAll: () => dispatch(clearAll())
  }
}

export default useOfttBeneficiary