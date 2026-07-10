import * as yup from 'yup'

export default {
  add: yup.object().shape({
    fullName: yup.string().required().min(5).max(30),
    userName: yup.string().required().min(1).max(30),
    status: yup.string().required().min(1).max(30),
  })
}
