import * as yup from 'yup'

export default {
  add: yup.object().shape({
    accountNumber: yup.string(),
  })
}
