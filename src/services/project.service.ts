import requests from 'src/services/httpService';
import { AxiosResponse } from 'axios'
import { GetParams } from 'src/services/service'

const Services = {
    getAll({ query }: GetParams): Promise<AxiosResponse> {
        return requests.get(`/projects?${query}`);
    },
    getById(id: string): Promise<AxiosResponse> {
        return requests.get(`/projects/${id}`);
    },
    add(body: any): Promise<AxiosResponse> {
        return requests.post('/projects', body);
    },
    update(id: string, body: any): Promise<AxiosResponse> {
        return requests.put(`/projects/${id}`, body);
    },
    delete(id: string): Promise<AxiosResponse> {
        return requests.delete(`/projects/${id}`);
    },
};

export default Services;
