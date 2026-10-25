import {
  EarlyCancellationStrategy,
  ModerateCancellationStrategy,
  LateCancellationStrategy,
  LastMinuteCancellationStrategy,
} from './RefundStrategies.js';

export class RefundContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  // Factory/Context method to pick the correct strategy based on journey date and current time
  static selectStrategyByHours(hoursUntilDeparture) {
    if (hoursUntilDeparture >= 48) {
      return new EarlyCancellationStrategy();
    } else if (hoursUntilDeparture >= 12) {
      return new ModerateCancellationStrategy();
    } else if (hoursUntilDeparture >= 4) {
      return new LateCancellationStrategy();
    } else {
      return new LastMinuteCancellationStrategy();
    }
  }

  computeRefund(totalFare) {
    if (!this.strategy) {
      throw new Error('Refund strategy is not configured.');
    }
    return {
      refundAmount: this.strategy.calculateRefund(totalFare),
      ruleApplied: this.strategy.getRuleDescription()
    };
  }
}
