import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from 'src/store'
import {
  createPackageAction,
  fetchPackageActivitiesAction,
  fetchPackageGroupsAction,
  fetchPackagesAction
} from 'src/store/apps/limit-package'
import { ILimitPackagePayload } from 'src/types/apps/limitPackage'


export const useLimitPackages = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.limitPackage)

  const fetchPackages = () => dispatch(fetchPackagesAction()).unwrap()
  const createPackage = (payload: ILimitPackagePayload) => dispatch(createPackageAction(payload)).unwrap()

  return {
    packages: store.packages,
    status: store.packagesStatus,
    fetchPackages,
    createPackage
  }
}

export const usePackageGroups = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.limitPackage)

  const fetchGroups = () => dispatch(fetchPackageGroupsAction()).unwrap()

  return {
    groups: store.groups,
    status: store.groupsStatus,
    fetchGroups
  }
}

export const usePackageActivities = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.limitPackage)

  const fetchActivities = (enterpriseRoleId: number | string) =>
    dispatch(fetchPackageActivitiesAction(enterpriseRoleId)).unwrap()

  return {
    activities: store.activities,
    status: store.activitiesStatus,
    fetchActivities
  }
}