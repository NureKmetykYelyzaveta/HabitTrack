import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Config from '../config';

const API_BASE_URL = Config.getApiUrl();

class APIService {
  constructor() {
    this.token = null;
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: Config.REQUEST_TIMEOUT,
    });

    // Додаємо інтерцептор для додавання токена в заголовки
    this.api.interceptors.request.use(
      config => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        if (Config.LOG_NETWORK) {
          console.log(`📡 ${config.method.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Логування відповідей
    this.api.interceptors.response.use(
      response => {
        if (Config.LOG_NETWORK) {
          console.log(`✅ ${response.status} ${response.config.url}`);
        }
        return response;
      },
      error => {
        if (Config.LOG_NETWORK) {
          console.log(`❌ ${error.response?.status} ${error.config?.url}`);
        }
        return Promise.reject(error);
      }
    );
  }

  async login(email, password) {
    try {
      const response = await this.api.post('/auth/login', { email, password });
      this.token = response.data.token;
      await SecureStore.setItemAsync(Config.TOKEN_KEY, this.token);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async register(username, email, password) {
    try {
      const response = await this.api.post('/auth/register', {
        username,
        email,
        password,
      });
      this.token = response.data.token;
      await SecureStore.setItemAsync(Config.TOKEN_KEY, this.token);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getUser() {
    try {
      const response = await this.api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async updateProfile(userId, data) {
    try {
      const response = await this.api.put(`/user/${userId}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Habits API
  async getHabits() {
    try {
      const response = await this.api.get('/habit');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getHabitsByUser(userId) {
    try {
      const response = await this.api.get(`/habit/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async createHabit(habitData) {
    try {
      const response = await this.api.post('/habit', habitData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async updateHabit(habitId, habitData) {
    try {
      const response = await this.api.put(`/habit/${habitId}`, habitData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async deleteHabit(habitId, userId) {
    try {
      const response = await this.api.delete(`/habit/${habitId}?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async completeHabit(habitId, userId) {
    try {
      const response = await this.api.post(`/habit/${habitId}/complete?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getStats() {
    try {
      const response = await this.api.get('/habit/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Archive API
  async getArchivedHabits(userId) {
    try {
      const response = await this.api.get(`/habit/user/${userId}/archived`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async archiveHabit(habitId, userId) {
    try {
      const response = await this.api.post(`/habit/${habitId}/archive?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async unarchiveHabit(habitId, userId) {
    try {
      const response = await this.api.post(`/habit/${habitId}/unarchive?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async logout() {
    try {
      await SecureStore.deleteItemAsync(Config.TOKEN_KEY);
      this.token = null;
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}

export default new APIService();
