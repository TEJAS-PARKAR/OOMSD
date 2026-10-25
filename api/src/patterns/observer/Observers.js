export class EmailNotificationObserver {
  constructor() {
    this.name = 'EmailNotificationService';
  }

  async update(eventType, data) {
    const message = eventType === 'BOOKING_CONFIRMED'
      ? `📧 [EMAIL SENT] To: ${data.passengerEmail} | Subject: Booking Confirmed (PNR: ${data.pnr}) on Train ${data.trainNumber} on ${data.journeyDate}. Amount: Rs.${data.totalFare}`
      : `📧 [EMAIL SENT] To: ${data.passengerEmail} | Subject: Ticket Cancelled (PNR: ${data.pnr}). Refund of Rs.${data.refundAmount} initiated.`;
    console.log(message);
    return { channel: 'Email', status: 'Delivered', recipient: data.passengerEmail };
  }
}

export class SMSNotificationObserver {
  constructor() {
    this.name = 'SMSNotificationService';
  }

  async update(eventType, data) {
    const text = eventType === 'BOOKING_CONFIRMED'
      ? `📱 [SMS SENT] Dear Passenger, PNR ${data.pnr} is CONFIRMED. Total: Rs.${data.totalFare}. Happy Journey! - IRCTC`
      : `📱 [SMS SENT] Dear Passenger, PNR ${data.pnr} has been CANCELLED. Refund: Rs.${data.refundAmount}. - IRCTC`;
    console.log(text);
    return { channel: 'SMS', status: 'Delivered', recipient: data.passengerPhone || 'Registered Mobile' };
  }
}

export class AuditLogObserver {
  constructor() {
    this.name = 'AuditLogService';
  }

  async update(eventType, data) {
    const logEntry = `📝 [AUDIT LOG] ${new Date().toISOString()} | EVENT: ${eventType} | PNR: ${data.pnr} | BY: ${data.passengerId || 'SYSTEM'}`;
    console.log(logEntry);
    return { channel: 'Audit', status: 'Logged', timestamp: new Date().toISOString() };
  }
}
