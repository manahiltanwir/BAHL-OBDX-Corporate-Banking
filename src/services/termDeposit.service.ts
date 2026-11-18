import httpService from 'src/services/httpService'
import {
  TermDepositAccount,
  TermDepositDetails,
  TermDepositDetailsPayload,
  TermDepositResponse
} from 'src/types/apps/termDeposit'

export const getTermDepositAccounts = (partyId: string) =>
  httpService.get<TermDepositResponse<TermDepositAccount[]>>(`/td-service/term-deposit/${partyId}`)

export const getTermDepositDetails = (payload: TermDepositDetailsPayload) =>
  httpService.post<TermDepositResponse<TermDepositDetails>>('/td-service/term-deposit/details', payload)

// export const getTermDepositDetails = (payload: TermDepositDetailsPayload) =>
//   httpService.get<TermDepositResponse<TermDepositDetails>>('/td-service/term-deposit/details', {
//     params: payload
//   })