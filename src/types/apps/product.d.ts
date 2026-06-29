export interface IProduct {
    id: string
    title: string,
    subTitle: string,
    desc: string,
    price: number,
    featured_image: string,
    categories: string[],
    gallery?: string[],
    tags: string[]
}
