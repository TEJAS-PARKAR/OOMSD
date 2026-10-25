import { IPaymentGateway } from './IPaymentGateway.js';

// Third-party external Mock Service (Adaptee)
class MockThirdPartyPaymentSDK {
  executeCharge(chargePayload) {
    // Simulates external bank API call latency and responses
    const isSuccess = true;
    return {
      status_code: isSuccess ? 'TXN_SUCCESS' : 'TXN_FAILURE',
      provider_ref_id: `EXT_PG_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      currency: 'INR',
      amount_charged: chargePayload.amt,
      timestamp: new Date().toISOString()
    };
  }

  executeReversal(reversalPayload) {
    return {
      status_code: 'REFUND_SETTLED',
      reversal_id: `REV_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      amount_refunded: reversalPayload.refundAmt,
      original_txn: reversalPayload.origRef,
      timestamp: new Date().toISOString()
    };
  }
}

// PaymentGatewayAdapter: Implements IPaymentGateway and translates to Adaptee
export class PaymentGatewayAdapter extends IPaymentGateway {
  constructor() {
    super();
    this.adaptee = new MockThirdPartyPaymentSDK();
  }

  async processPayment({ pnr, amount, paymentMethod }) {
    // Translate domain inputs to Adaptee parameters
    const adapteeRequest = {
      orderId: pnr,
      amt: parseFloat(amount),
      channel: paymentMethod,
    };

    const adapteeResponse = this.adaptee.executeCharge(adapteeRequest);

    return {
      success: adapteeResponse.status_code === 'TXN_SUCCESS',
      transactionReference: adapteeResponse.provider_ref_id,
      amount: adapteeResponse.amount_charged,
      status: 'SUCCESS',
      date: adapteeResponse.timestamp
    };
  }

  async processRefund({ pnr, transactionReference, refundAmount }) {
    // Translate domain refund to Adaptee reversal
    const adapteeReversal = {
      pnrId: pnr,
      origRef: transactionReference,
      refundAmt: parseFloat(refundAmount)
    };

    const result = this.adaptee.executeReversal(adapteeReversal);

    return {
      success: result.status_code === 'REFUND_SETTLED',
      refundReference: result.reversal_id,
      refundAmount: result.amount_refunded,
      status: 'REFUNDED',
      date: result.timestamp
    };
  }
}
