import { Passenger } from './Passenger.js';

export class Admin extends Passenger {
  constructor(adminProps) {
    super({ ...adminProps, Role: 'Admin' });
  }

  static async getSystemMetrics() {
    // Return operational metrics for the Admin Dashboard
    return {
      serverTime: new Date().toISOString(),
      activeClusterNodes: 2,
      databaseType: 'PostgreSQL 3NF Relational',
      cacheStatus: 'Active (Redis/Cache-Aside)',
      totalBookingsToday: 142
    };
  }
}
