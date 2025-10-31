import { apiCache } from "./cache";

// Cache management utilities for development and debugging
export const cacheUtils = {
  // Get cache statistics
  getStats() {
    const cache = (apiCache as any).cache; // Access private cache Map
    const entries = Array.from(cache.entries()).map((entry: any) => {
      const [key, value] = entry;
      return {
        key,
        timestamp: value.timestamp,
        ttl: value.ttl,
        age: Date.now() - value.timestamp,
        expired: Date.now() - value.timestamp > value.ttl,
      };
    });

    const stats = {
      size: cache.size,
      keys: Array.from(cache.keys()),
      entries,
    };

    console.table(stats.entries);
    return stats;
  },

  // Force refresh specific data
  async refreshExperiences() {
    apiCache.delete("experiences");
    console.log("Experiences cache cleared");
  },

  // Clear all cache
  clearAll() {
    apiCache.clear();
    console.log("All cache cleared");
  },

  // Log cache hit/miss for debugging
  logCacheStatus(key: string, hit: boolean) {
    const status = hit ? "✅ HIT" : "❌ MISS";
    console.log(`Cache ${status}: ${key}`);
  },
};

// Make it available globally for development
if (typeof window !== "undefined") {
  (window as any).cacheUtils = cacheUtils;
}
