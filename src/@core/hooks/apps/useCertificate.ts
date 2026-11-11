import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { requestAccountStatementAction, requestBalanceCertificateAction, requestMaintenanceCertificateAction } from 'src/store/apps/certificate'
import { AccountStatementPayload, CertificateRequestPayload, BalanceCertificatePayload } from 'src/types/apps/certificate'

const useCertificate = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { status } = useSelector((state: RootState) => state.certificate)

  const requestBalanceCertificate = useCallback(
    (data: BalanceCertificatePayload) => dispatch(requestBalanceCertificateAction({ data })).unwrap(),
    [dispatch]
  )

  const requestMaintenanceCertificate = useCallback(
    (data: CertificateRequestPayload) => dispatch(requestMaintenanceCertificateAction({ data })).unwrap(),
    [dispatch]
  )

  const requestAccountStatement = useCallback(
    (data: AccountStatementPayload) =>
dispatch(requestAccountStatementAction({ data })).unwrap(),
    [dispatch]
  )

  return {
    status,
    isLoading: status === 'pending',
    requestBalanceCertificate,
    requestMaintenanceCertificate,
    requestAccountStatement
  }
}

export default useCertificate