import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { clearAll, createOfttPaymentAction } from 'src/store/apps/oftt-payment'
import { toOfttPaymentPayload } from 'src/services'
import { OfttPaymentForm } from 'src/types/apps/ofttPayment'

const useOfttPayment = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { result, status } = useSelector((state: RootState) => state.ofttPayment)

  const createPayment = (form: OfttPaymentForm) =>
    dispatch(createOfttPaymentAction(toOfttPaymentPayload(form))).unwrap()

  return {
    result,
    status,
    isLoading: status === 'pending',
    createPayment,
    clearAll: () => dispatch(clearAll())
  }
}

export default useOfttPayment