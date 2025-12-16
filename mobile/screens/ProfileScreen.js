import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import Glass from "../components/Glass";
import { colors } from "../theme";
import { AuthContext } from "../context/AuthContext";
import apiService from "../services/api";

export default function ProfileScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);
  const onLogout = route?.params?.onLogout;
  const [user, setUser] = useState(authContext.user);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  const handleLogout = () => {
    Alert.alert("Вихід", "Ви впевнені?", [
      { text: "Скасувати" },
      {
        text: "Вихід",
        onPress: async () => {
          if (onLogout) {
            await onLogout();
          }
        },
      },
    ]);
  };

  const handleSaveProfile = async () => {
    if (!formData.username || !formData.email) {
      Alert.alert("Помилка", "Заповніть всі поля");
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.updateProfile(user?.userId, formData);
      setUser(response);
      setEditMode(false);
      Alert.alert("Успіх", "Профіль оновлено");
    } catch (error) {
      Alert.alert("Помилка", "Не вдалося оновити профіль");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    Alert.alert("Зміна пароля", "Введіть новий пароль", [
      {
        text: "Скасувати",
      },
      {
        text: "Змінити",
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <Glass style={styles.statsSection}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>💰</Text>
              <Text style={styles.statLabel}>Баланс</Text>
              <Text style={styles.statValue}>{user?.balance || 0} ₽</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>📅</Text>
              <Text style={styles.statLabel}>Членство</Text>
              <Text style={styles.statValue}>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("uk-UA")
                  : "N/A"}
              </Text>
            </View>
          </View>
        </Glass>

        <Glass style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>👤 Особисті дані</Text>
            <TouchableOpacity onPress={() => setEditMode(!editMode)}>
              <Text style={styles.editBtn}>
                {editMode ? "Скасувати" : "✏️ Редагувати"}
              </Text>
            </TouchableOpacity>
          </View>

          {editMode ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ім'я користувача</Text>
                <TextInput
                  style={styles.input}
                  value={formData.username}
                  onChangeText={(text) =>
                    setFormData({ ...formData, username: text })
                  }
                  placeholder="Ім'я користувача"
                  placeholderTextColor="#888"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData({ ...formData, email: text })
                  }
                  placeholder="Email"
                  placeholderTextColor="#888"
                  editable={false}
                />
              </View>

              <TouchableOpacity
                style={[styles.btn, styles.btnSave]}
                onPress={handleSaveProfile}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.btnText}>Зберегти</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Ім'я користувача</Text>
                <Text style={styles.infoValue}>{user?.username}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Роль</Text>
                <Text style={styles.infoValue}>
                  {user?.role === "admin" ? "Адміністратор" : "Користувач"}
                </Text>
              </View>
            </>
          )}
        </Glass>

        <Glass style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 Безпека</Text>

          <TouchableOpacity
            style={[styles.optionBtn, styles.optionBtnWarning]}
            onPress={handleChangePassword}
          >
            <Text style={styles.optionBtnText}>🔑 Змінити пароль</Text>
          </TouchableOpacity>
        </Glass>

        <Glass style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ Про додаток</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Версія</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Розробник</Text>
            <Text style={styles.infoValue}>HabitTrack Team</Text>
          </View>
        </Glass>

        <TouchableOpacity
          style={[styles.btn, styles.btnLogout]}
          onPress={handleLogout}
        >
          <Text style={styles.btnLogoutText}>🚪 Вихід</Text>
        </TouchableOpacity>

        <View style={styles.spacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.neon,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  username: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    color: "#aaa",
    fontSize: 14,
  },
  statsSection: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statLabel: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: colors.neon,
    fontSize: 18,
    fontWeight: "bold",
  },
  section: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.neon,
    fontSize: 18,
    fontWeight: "bold",
  },
  editBtn: {
    color: colors.neon,
    fontSize: 14,
    fontWeight: "bold",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: colors.neon,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 136, 0.2)",
    color: colors.text,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  infoItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 255, 136, 0.1)",
  },
  infoLabel: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 4,
  },
  infoValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "500",
  },
  optionBtn: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
  },
  optionBtnWarning: {
    borderColor: "#ff9800",
    backgroundColor: "rgba(255, 152, 0, 0.1)",
  },
  optionBtnText: {
    color: "#ff9800",
    fontWeight: "bold",
    fontSize: 14,
  },
  btn: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  btnSave: {
    backgroundColor: colors.neon,
  },
  btnText: {
    color: "#000",
    fontWeight: "bold",
  },
  btnLogout: {
    backgroundColor: "rgba(255, 100, 100, 0.1)",
    borderWidth: 2,
    borderColor: "#ff6464",
    marginTop: 20,
  },
  btnLogoutText: {
    color: "#ff6464",
    fontWeight: "bold",
  },
  spacing: {
    height: 20,
  },
});
