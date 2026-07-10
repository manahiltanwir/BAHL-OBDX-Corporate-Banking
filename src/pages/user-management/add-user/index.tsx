const Page = () => {
  return (
    <h1>Hello From Add User Page</h1>
  )
}


Page.acl = {
  action: 'itsHaveAccess',
  subject: 'add-user-page'
}

export default Page