const Page = () => {
    return <h1>Hello from Review Page</h1>
}


Page.acl = {
    action: 'itsHaveAccess',
    subject: 'review-user-page'
}

export default Page;