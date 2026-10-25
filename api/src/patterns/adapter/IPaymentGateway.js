// IPaymentGateway Interface (Standard Target Interface for Adapter Pattern)
export class IPaymentGateway {
  async processPayment({ pnr, amount, paymentMethod }) {
    throw new Error('processPayment must be implemented by concrete adapter');
  }

  async processRefund({ pnr, transactionReference, refundAmount }) {
    throw new Error('processRefund must be implemented by concrete adapter');
  }
}
