import * as yup from 'yup'

export default {
    add: yup.object().shape({
        title: yup.string().required().min(5).max(30),
        subTitle: yup.string().required().min(1).max(5),
        desc: yup.string().required().min(1).max(30),
        price: yup.number().required().min(1).max(30),
        featured_image: yup.string().required().min(1).max(30),
        categories: yup.array().of(yup.string()).required(),
        gallery: yup.array().of(yup.string()),
        tags: yup.array().of(yup.string()).required(),
        id: yup.string(),
    })
}
