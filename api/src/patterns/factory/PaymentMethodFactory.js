class UPIPaymentProcessor {
  validate(details) {
    if (!details.vpa || !details.vpa.includes('@')) {
      throw new Error('Invalid UPI Virtual Payment Address (e.g. user@okhdfcbank)');
    }
    return true;
  }
  getGatewayType() { return 'UPI_INSTANT'; }
}

class CardPaymentProcessor {
  validate(details) {
    if (!details.cardNumber || details.cardNumber.replace(/\s+/g, '').length < 12) {
      throw new Error('Invalid 16-digit Card Number');
    }
    return true;
  }
  getGatewayType() { return 'CARD_NETWORK'; }
}

class NetBankingProcessor {
  validate(details) {
    if (!details.bankCode) {
      throw new Error('Please select a valid bank for NetBanking');
    }
    return true;
  }
  getGatewayType() { return 'NET_BANKING_CORE'; }
}

export class PaymentMethodFactory {
  static getProcessor(method) {
    switch (method) {
      case 'UPI':
        return new UPIPaymentProcessor();
      case 'CreditCard':
      case 'DebitCard':
        return new CardPaymentProcessor();
      case 'NetBanking':
        return new NetBankingProcessor();
      default:
        throw new Error(`Unsupported payment method: ${method}. Must be UPI, CreditCard, DebitCard, or NetBanking.`);
    }
  }
}
