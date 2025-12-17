import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";

import LoginScreen from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import HabitsScreen from "./screens/HabitsScreen";
import StatsScreen from "./screens/StatsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ArchiveScreen from "./screens/ArchiveScreen";
import { AuthProvider } from "./context/AuthContext";
import apiService from "./services/api";

const Stack = createNativeStackNavigator();

function RootNavigator({ onLogout }) {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      if (token) {
        apiService.token = token;
        setUserToken(token);
      }
    } catch (e) {
      console.error("Failed to restore token", e);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("auth_token");
      apiService.token = null;
      setUserToken(null);
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0a0a0a",
        },
        headerTintColor: "#00ff88",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        cardStyle: { backgroundColor: "#0a0a0a" },
      }}
    >
      {userToken == null ? (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: "Реєстрація" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "HabitTrack", headerBackVisible: false }}
          />
          <Stack.Screen
            name="Habits"
            component={HabitsScreen}
            options={{ title: "Мої звички" }}
          />
          <Stack.Screen
            name="Stats"
            component={StatsScreen}
            options={{ title: "Статистика" }}
          />
          <Stack.Screen
            name="Archive"
            component={ArchiveScreen}
            options={{ title: "Архів" }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: "Профіль" }}
            initialParams={{ onLogout: logout }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
