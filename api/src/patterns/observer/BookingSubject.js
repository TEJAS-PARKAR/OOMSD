export class BookingSubject {
  constructor() {
    this.observers = [];
  }

  attach(observer) {
    this.observers.push(observer);
  }

  detach(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  async notify(eventType, eventData) {
    console.log(`📢 [BookingSubject] Dispatching event: "${eventType}" for PNR: ${eventData.pnr || 'N/A'}`);
    const results = [];
    for (const observer of this.observers) {
      try {
        const res = await observer.update(eventType, eventData);
        results.push(res);
      } catch (err) {
        console.error(`❌ Observer ${observer.name || 'unnamed'} failed:`, err.message);
      }
    }
    return results;
  }
}
