import httpService from 'src/services/httpService'
import { RecentTransactionsPayload, RecentTransactionsResponse } from 'src/types/apps/recentTransactions'

export const getRecentTransactions = (payload: RecentTransactionsPayload) =>
  httpService.post<RecentTransactionsResponse>('/view-statement-service/api/view-statement/recent-transactions', payload)
