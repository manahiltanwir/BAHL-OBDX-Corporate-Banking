import requests from 'src/services/httpService';
import { AxiosResponse } from 'axios'
import { GetParams } from 'src/services/service'

const Services = {
    getAll({ query }: GetParams): Promise<AxiosResponse> {
        return requests.get(`/assignments?${query}`);
    },
    getById(id: string): Promise<AxiosResponse> {
        return requests.get(`/assignments/${id}`);
    },
    add(body: any): Promise<AxiosResponse> {
        return requests.post('/assignments', body);
    },
    update(id: string, body: any): Promise<AxiosResponse> {
        return requests.put(`/assignments/${id}`, body);
    },
    delete(id: string): Promise<AxiosResponse> {
        return requests.delete(`/assignments/${id}`);
    },
};

export default Services;
