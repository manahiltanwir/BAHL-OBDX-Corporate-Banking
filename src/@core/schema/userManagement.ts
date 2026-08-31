import * as yup from 'yup'

export default {
  add: yup.object().shape({
    fullName: yup.string().optional().min(5).max(30),
    username: yup.string().optional().min(3).max(30),
    status: yup.string().optional().min(1).max(30),
    partyId: yup.string().optional().max(30),
    userId: yup.string().optional().max(30),
    mobileNumber: yup.string().optional().max(30),
    firstName: yup.string().optional().max(30),
    lastName: yup.string().optional().max(30),
    email: yup.string().optional().max(30),
    passport: yup.string().optional().max(30),
  })
}
