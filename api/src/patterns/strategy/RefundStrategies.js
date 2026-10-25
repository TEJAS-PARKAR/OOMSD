// Base Strategy Interface
export class IRefundStrategy {
  calculateRefund(totalFare) {
    throw new Error('calculateRefund must be implemented');
  }
  getRuleDescription() {
    throw new Error('getRuleDescription must be implemented');
  }
}

// 1. More than 48 hours before departure: 90% refund (10% clerkage charge)
export class EarlyCancellationStrategy extends IRefundStrategy {
  calculateRefund(totalFare) {
    const refund = Math.max(0, totalFare * 0.90);
    return parseFloat(refund.toFixed(2));
  }
  getRuleDescription() {
    return 'Cancelled > 48 hrs before departure: 90% refund (10% clerkage deducted)';
  }
}

// 2. Between 12 and 48 hours before departure: 75% refund (25% deduction)
export class ModerateCancellationStrategy extends IRefundStrategy {
  calculateRefund(totalFare) {
    const refund = Math.max(0, totalFare * 0.75);
    return parseFloat(refund.toFixed(2));
  }
  getRuleDescription() {
    return 'Cancelled 12 to 48 hrs before departure: 75% refund (25% deducted)';
  }
}

// 3. Between 4 and 12 hours before departure: 50% refund (50% deduction)
export class LateCancellationStrategy extends IRefundStrategy {
  calculateRefund(totalFare) {
    const refund = Math.max(0, totalFare * 0.50);
    return parseFloat(refund.toFixed(2));
  }
  getRuleDescription() {
    return 'Cancelled 4 to 12 hrs before departure: 50% refund (50% deducted)';
  }
}

// 4. Less than 4 hours before departure: 0% refund (No refund after chart preparation)
export class LastMinuteCancellationStrategy extends IRefundStrategy {
  calculateRefund(totalFare) {
    return 0.00;
  }
  getRuleDescription() {
    return 'Cancelled < 4 hrs before departure: No refund applicable';
  }
}
