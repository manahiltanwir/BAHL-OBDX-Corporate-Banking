import http from 'src/services/httpService';
import { AxiosResponse } from 'axios'
import { SubscriptionForm } from 'src/types/apps/subscription';

const Services = {
  createPaymentIntent(body: SubscriptionForm): Promise<AxiosResponse> {
    return http.post(`/invoice/payment_intents`, body);
  },
  paymentIntentConfirm(intentId: string): Promise<AxiosResponse> {
    return http.get(`/invoice/payment_intents/confirm/${intentId}`,);
  },
  getInvoices(): Promise<AxiosResponse> {
    return http.get(`/invoice`);
  }
};

export default Services;
