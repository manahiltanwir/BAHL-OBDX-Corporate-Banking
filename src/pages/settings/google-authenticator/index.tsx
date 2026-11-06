import EnableGoogleAuthView from 'src/views/pages/auth/EnableGoogleAuthView';

const Page = () => <EnableGoogleAuthView />

export default Page

Page.acl = {
    action: 'itsHaveAccess',
    subject: 'settings-change-username-page'
}