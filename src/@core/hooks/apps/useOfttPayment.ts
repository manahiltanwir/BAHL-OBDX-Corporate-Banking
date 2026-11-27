import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { AppDispatch, RootState } from 'src/store'
import { clearAll, createOfttPaymentAction, createOfttBeneficiaryPaymentAction } from 'src/store/apps/oftt-payment'
import {
  toOfttPaymentPayload,
  toOfttBeneficiaryPaymentPayload,
  validateOfttBeneficiaryPayment
} from 'src/services'
import { OfttBeneficiaryPaymentForm, OfttPaymentForm } from 'src/types/apps/ofttPayment'

const useOfttPayment = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { result, status } = useSelector((state: RootState) => state.ofttPayment)

  const createPayment = (form: OfttPaymentForm) =>
    dispatch(createOfttPaymentAction(toOfttPaymentPayload(form))).unwrap()

  const createBeneficiaryPayment = (form: OfttBeneficiaryPaymentForm) => {
    const payload = toOfttBeneficiaryPaymentPayload(form)
    const message = validateOfttBeneficiaryPayment(payload)

    if (message) {
      toast.error(message)

      return Promise.reject(new Error(message))
    }

    return dispatch(createOfttBeneficiaryPaymentAction(payload)).unwrap()
  }

  return {
    result,
    status,
    isLoading: status === 'pending',
    createPayment,
    createBeneficiaryPayment,
    clearAll: () => dispatch(clearAll())
  }
}

export default useOfttPayment