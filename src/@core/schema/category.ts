import * as yup from 'yup'

export default {
  add: yup.object().shape({
    name: yup.string().required().min(5).max(30),
    order: yup.string().required().min(1).max(5),
    title: yup.string().required().min(1).max(30),
  })
}
