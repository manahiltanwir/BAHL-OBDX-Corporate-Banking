import * as yup from 'yup'

export default {
  add: yup.object().shape({
    alreadyExist: yup.boolean().optional(),
    partyId: yup.string().required().min(5).max(30),
    partyName: yup.string().optional().max(30),
    partyStatus: yup.string().optional().max(30),
    statusReason: yup.string().optional().max(30),
  })
}
