/**
 * Конфігурація додатку HabitTrack
 * Відредагуйте це значення для різних середовищ
 */

import { Platform } from "react-native";

const Config = {
  // API базовий URL - змініть залежно від вашого backend
  API_BASE_URL:
    process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api",

  // Таймаут для запитів (мс)
  REQUEST_TIMEOUT: 10000,

  // Ключ для зберігання токена
  TOKEN_KEY: "auth_token",

  // Дебаг режим
  DEBUG: true,

  // Логування мережевих запитів
  LOG_NETWORK: true,

  // Налаштування для Android емулятора (замість localhost)
  ANDROID_EMULATOR_API_URL: "http://10.0.2.2:5000/api",

  // Перевірити чи ми на Android емуляторі
  isAndroidEmulator: () => {
    return (
      typeof __DEV__ !== "undefined" &&
      __DEV__ &&
      Platform.OS === "android"
    );
  },

  // Отримати правильний API URL
  getApiUrl: () => {
    if (Config.isAndroidEmulator()) {
      return Config.ANDROID_EMULATOR_API_URL;
    }
    return Config.API_BASE_URL;
  },
};

export default Config;
