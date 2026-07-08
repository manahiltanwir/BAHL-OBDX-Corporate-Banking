import React, { useEffect, useState } from 'react'
import CategoryTable from 'src/@core/components/apps/category/components/Table'
import TableHeader from 'src/@core/components/apps/category/components/TableHeader'
import ExampleDrawer from 'src/@core/components/apps/category/components/Drawer'
import SelectOne from 'src/@core/components/apps/category/components/SelectOne'
import SelectMany from 'src/@core/components/apps/category/components/SelectMany'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import DeleteAlert from 'src/@core/components/common/deleteAlert'
import { ModalType } from 'src/types'
import { useCategory } from 'src/@core/hooks/apps/useCategory'
import MultipleInput from 'src/@core/components/common/MultipleInput'
import { useGetPokemonByNameQuery } from 'src/store/apps/category/rtk'

const Page = () => {

  return (
    <React.Fragment>
      <h1>Party Management Page</h1>
    </React.Fragment>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'party-management-page'
}

export default Page
