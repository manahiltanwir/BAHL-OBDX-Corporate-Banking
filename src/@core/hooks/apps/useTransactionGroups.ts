import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from 'src/store'
import {
  createGroupAction,
  deactivateGroupAction,
  fetchGroupsAction,
  fetchTransactionsAction,
  updateGroupAction
} from 'src/store/apps/transaction-group'
import { IActivityGroupPayload } from 'src/types/apps/transactionGroup'

export const useTransactionGroupsList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.transactionGroup)

  const fetchGroups = () => dispatch(fetchGroupsAction()).unwrap()

  return {
    groups: store.groups,
    status: store.groupsStatus,
    fetchGroups
  }
}

export const useGroupTransactions = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.transactionGroup)

  const nameByCode = useMemo(() => {
    const map: Record<string, string> = {}
    store.transactions.forEach(t => (map[t.transactionCode] = t.transactionName))

    return map
  }, [store.transactions])

  const nameOf = (code: string) => nameByCode[code] ?? code

  const fetchTransactions = (enterpriseRoleId: number | string) =>
    dispatch(fetchTransactionsAction(enterpriseRoleId)).unwrap()

  return {
    transactionOptions: store.transactions,
    status: store.transactionsStatus,
    nameOf,
    fetchTransactions
  }
}

export const useGroupSubmit = () => {
  const dispatch = useDispatch<AppDispatch>()

  const createGroup = (payload: IActivityGroupPayload) => dispatch(createGroupAction(payload)).unwrap()
  const updateGroup = (id: number | string, payload: IActivityGroupPayload) =>
    dispatch(updateGroupAction({ id, data: payload })).unwrap()

  return { createGroup, updateGroup }
}

export const useGroupDeactivate = () => {
  const dispatch = useDispatch<AppDispatch>()

  const deactivateGroup = (id: number | string, groupCode: string) =>
    dispatch(deactivateGroupAction({ id, groupCode })).unwrap()

  return { deactivateGroup }
}