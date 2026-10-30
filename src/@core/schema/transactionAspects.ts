import * as yup from 'yup'

export default {
 update: yup.array().of(
    yup.object().shape({
      aspectId: yup.number().integer().positive().required(),
      isEnabled: yup.string().oneOf(['Y', 'N']).required(),
      updatedBy: yup.string().trim().required(),
    })
  ).min(1).required()
}

