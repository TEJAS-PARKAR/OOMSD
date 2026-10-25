import { query, inMemoryStore, isConnectedToPostgres } from '../config/database.js';

export class Payment {
  constructor({
    PaymentID,
    PNR,
    Amount,
    PaymentMethod,
    PaymentStatus = 'SUCCESS',
    TransactionReference,
    PaymentDate,
    RefundAmount = 0.00
  }) {
    this.paymentID = PaymentID;
    this.pnr = PNR;
    this.amount = parseFloat(Amount);
    this.paymentMethod = PaymentMethod;
    this.paymentStatus = PaymentStatus;
    this.transactionReference = TransactionReference;
    this.paymentDate = PaymentDate || new Date().toISOString();
    this.refundAmount = parseFloat(RefundAmount);
  }

  static async findByPNR(pnr) {
    if (isConnectedToPostgres) {
      const res = await query('SELECT * FROM PAYMENT WHERE UPPER(PNR) = $1', [pnr.toUpperCase()]);
      return res.rows[0] ? new Payment(res.rows[0]) : null;
    }
    const found = inMemoryStore.payments.find((p) => p.PNR.toUpperCase() === pnr.toUpperCase());
    return found ? new Payment(found) : null;
  }

  static async create(paymentData) {
    const {
      PaymentID,
      PNR,
      Amount,
      PaymentMethod,
      PaymentStatus = 'SUCCESS',
      TransactionReference,
      RefundAmount = 0.00
    } = paymentData;

    if (isConnectedToPostgres) {
      const sql = `
        INSERT INTO PAYMENT (
          PaymentID, PNR, Amount, PaymentMethod, PaymentStatus, TransactionReference, RefundAmount
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const res = await query(sql, [
        PaymentID, PNR, Amount, PaymentMethod, PaymentStatus, TransactionReference, RefundAmount
      ]);
      return new Payment(res.rows[0]);
    }

    const newPay = {
      PaymentID,
      PNR,
      Amount: parseFloat(Amount),
      PaymentMethod,
      PaymentStatus,
      TransactionReference,
      PaymentDate: new Date().toISOString(),
      RefundAmount: parseFloat(RefundAmount)
    };
    inMemoryStore.payments.push(newPay);
    return new Payment(newPay);
  }

  static async updateRefund(pnr, refundAmount, newStatus = 'REFUNDED') {
    if (isConnectedToPostgres) {
      const sql = `
        UPDATE PAYMENT
        SET RefundAmount = $1, PaymentStatus = $2
        WHERE UPPER(PNR) = $3
        RETURNING *
      `;
      const res = await query(sql, [refundAmount, newStatus, pnr.toUpperCase()]);
      return res.rows[0] ? new Payment(res.rows[0]) : null;
    }

    const found = inMemoryStore.payments.find((p) => p.PNR.toUpperCase() === pnr.toUpperCase());
    if (found) {
      found.RefundAmount = parseFloat(refundAmount);
      found.PaymentStatus = newStatus;
      return new Payment(found);
    }
    return null;
  }
}
