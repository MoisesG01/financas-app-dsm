import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

// Usar SecureStore no mobile e AsyncStorage no web
const isWeb = Platform.OS === "web";
const storageAPI = isWeb ? AsyncStorage : SecureStore;

const getItem = async (key) => {
  try {
    if (isWeb) {
      return await AsyncStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error(`Erro ao buscar ${key}:`, error);
    return null;
  }
};

const setItem = async (key, value) => {
  try {
    if (isWeb) {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error(`Erro ao salvar ${key}:`, error);
  }
};

const removeItem = async (key) => {
  try {
    if (isWeb) {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error(`Erro ao remover ${key}:`, error);
  }
};

export const storage = {
  // Token
  async saveToken(token) {
    await setItem(TOKEN_KEY, token);
  },

  async getToken() {
    return await getItem(TOKEN_KEY);
  },

  async removeToken() {
    await removeItem(TOKEN_KEY);
  },

  // User data
  async saveUser(user) {
    await setItem(USER_KEY, JSON.stringify(user));
  },

  async getUser() {
    const user = await getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  async removeUser() {
    await removeItem(USER_KEY);
  },

  // Limpar tudo
  async clearAll() {
    await this.removeToken();
    await this.removeUser();
  },
};
