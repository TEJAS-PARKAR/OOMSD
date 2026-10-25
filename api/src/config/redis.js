import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

class CacheService {
  constructor() {
    this.redisClient = null;
    this.isConnected = false;
    this.localCache = new Map(); // Fallback in-memory cache with TTL
    this.cacheStats = { hits: 0, misses: 0 };
  }

  async connect() {
    try {
      this.redisClient = createClient({
        url: REDIS_URL,
        socket: {
          connectTimeout: 1000,
          reconnectStrategy: false,
        },
      });
      this.redisClient.on('error', (err) => {
        // Suppress repeated connection noise if redis is offline
        if (this.isConnected) {
          console.warn('⚠️ Redis connection error:', err.message);
        }
        this.isConnected = false;
      });

      await this.redisClient.connect();
      this.isConnected = true;
      console.log('✅ Connected to Redis cache service.');
    } catch (err) {
      this.isConnected = false;
      console.warn(`⚠️ Redis server unavailable (${err.message}). Using built-in Cache-Aside in-memory store.`);
    }
  }

  // Get cached value
  async get(key) {
    if (this.isConnected && this.redisClient) {
      try {
        const val = await this.redisClient.get(key);
        if (val) {
          this.cacheStats.hits++;
          return JSON.parse(val);
        }
      } catch (err) {
        console.warn('Redis GET error, falling back to local map:', err.message);
      }
    }

    // Check local TTL cache
    const item = this.localCache.get(key);
    if (item) {
      if (Date.now() < item.expiry) {
        this.cacheStats.hits++;
        return item.data;
      }
      this.localCache.delete(key);
    }
    this.cacheStats.misses++;
    return null;
  }

  // Set cached value with TTL (default: 300 seconds = 5 minutes)
  async set(key, value, ttlSeconds = 300) {
    const serialized = JSON.stringify(value);
    if (this.isConnected && this.redisClient) {
      try {
        await this.redisClient.setEx(key, ttlSeconds, serialized);
        return;
      } catch (err) {
        console.warn('Redis SET error, falling back to local map:', err.message);
      }
    }

    // Local TTL cache
    this.localCache.set(key, {
      data: value,
      expiry: Date.now() + ttlSeconds * 1000,
    });
  }

  // Invalidate cache (used during train/schedule updates)
  async del(patternOrKey) {
    if (this.isConnected && this.redisClient) {
      try {
        await this.redisClient.del(patternOrKey);
      } catch (err) {
        console.warn('Redis DEL error:', err.message);
      }
    }
    this.localCache.delete(patternOrKey);
  }

  getStats() {
    return {
      type: this.isConnected ? 'Redis Server' : 'In-Memory Cache-Aside',
      hits: this.cacheStats.hits,
      misses: this.cacheStats.misses,
      ratio: this.cacheStats.hits + this.cacheStats.misses > 0
        ? ((this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses)) * 100).toFixed(1) + '%'
        : '0%'
    };
  }
}

export const cache = new CacheService();
