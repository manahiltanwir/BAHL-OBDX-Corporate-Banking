const Page = () => {
    return (
        <h1>Hello From Empty Dashboard Page</h1>
    )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'empty-dashboard-page'
}


export default Page