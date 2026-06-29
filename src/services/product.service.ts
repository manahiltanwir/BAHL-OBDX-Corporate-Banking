import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { GetParams } from 'src/services/service'

const Services = {
    getAll(query: GetParams): Promise<AxiosResponse> {
        return requests.get(`/product`)
    },
    getById(query: any) {
        return requests.get(`/product/${query}`)
    },
    add(body: any) {
        return requests.post('/product', body)
    },
    update(id: string, body: any): Promise<AxiosResponse> {
        return requests.put(`/product/${id}`, body)
    },
    delete(id: string): Promise<AxiosResponse> {
        return requests.delete(`/product/${id}`)
    },
    search({ query }: GetParams): Promise<AxiosResponse> {
        return requests.get(`/product?${query}`)
    },

}

export default Services
