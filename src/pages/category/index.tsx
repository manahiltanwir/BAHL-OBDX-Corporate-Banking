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

  const { serviceId, isDrawerOpen, handleDrawer } = useToggleDrawer()
  const [fieldArray, setFieldArray] = useState<string[]>([]);

  const { store, getCategories, deleteCategory, exportCategories } = useCategory(serviceId)

  useEffect(() => {
    getCategories({ query: {} })
  }, [])

  // Using a query hook automatically fetches data and returns query values
  const { data, error, isLoading } = useGetPokemonByNameQuery('bulbasaur')
  // Individual hooks are also accessible under the generated endpoints:
  // const { data, error, isLoading } = pokemonApi.endpoints.getPokemonByName.useQuery('bulbasaur')
  // console.log(isLoading, error, data);

  const handleDeleteChannel = () => {
    serviceId && deleteCategory(serviceId)
  }

  return (
    <React.Fragment>
      <TableHeader value={''} handleFilter={() => { }} toggle={() => handleDrawer(null)} exportTable={() => exportCategories()} />
      <SelectOne execute={false} category={store.entity} setCategory={e => console.log(e)} />
      <SelectMany execute={false} categories={store.entities} setCategories={e => console.log(e)} />
      <MultipleInput InputArray={fieldArray} setInputArray={e => setFieldArray(e)} />
      <CategoryTable />
      <ExampleDrawer open={isDrawerOpen} serviceId={serviceId} toggle={() => handleDrawer(null)} />
      <DeleteAlert title='category' type={ModalType.DEFAULT} onAgree={() => handleDeleteChannel()} />
    </React.Fragment>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'category-page'
}

export default Page
