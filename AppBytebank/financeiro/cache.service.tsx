import AsyncStorage from "@react-native-async-storage/async-storage";

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      if (!data) {
        console.log(`🟡 [Cache] Nenhum dado encontrado para "${key}"`);
        return null;
      }

      const { value, timestamp, ttl } = JSON.parse(data);
      const isExpired = ttl && Date.now() - timestamp > ttl;

      if (isExpired) {
        console.log(`🔴 [Cache] Expirado -> removendo "${key}"`);
        await AsyncStorage.removeItem(key);
        return null;
      }

      console.log(`🟢 [Cache] HIT "${key}" →`, value);
      return value as T;
    } catch (error) {
      console.error("❌ [Cache] Erro ao ler cache:", error);
      return null;
    }
  }

  static async set<T>(key: string, value: T, ttlMs = 5 * 60 * 1000): Promise<void> {
    try {
      const item = {
        value,
        timestamp: Date.now(),
        ttl: ttlMs,
      };
      await AsyncStorage.setItem(key, JSON.stringify(item));
      console.log(`💾 [Cache] SET "${key}" (expira em ${ttlMs / 1000}s)`);
    } catch (error) {
      console.error("❌ [Cache] Erro ao salvar cache:", error);
    }
  }

  static async clear(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`🧹 [Cache] CLEAR "${key}"`);
    } catch (error) {
      console.error("❌ [Cache] Erro ao limpar cache:", error);
    }
  }
}
