import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import Glass from "../components/Glass";
import { colors } from "../theme";
import apiService from "../services/api";

export default function EditHabitScreen({ route, navigation }) {
  const { habit } = route.params;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: habit?.name || "",
    category: habit?.category || "спорт",
    repeatCount: habit?.repeatCount || 0,
  });

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Помилка", "Введіть назву звички");
      return;
    }

    setLoading(true);
    try {
      await apiService.updateHabit(habit.habitId, formData);
      Alert.alert("Успіх", "Звичку оновлено");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Помилка", "Не вдалося зберегти звичку");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Видалити звичку?",
      `Видалити "${habit.name}"?`,
      [
        { text: "Скасувати" },
        {
          text: "Видалити",
          onPress: async () => {
            setLoading(true);
            try {
              await apiService.deleteHabit(habit.habitId);
              Alert.alert("Успіх", "Звичку видалено");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Помилка", "Не вдалося видалити звичку");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Редагування звички</Text>
        </View>

        <Glass style={styles.section}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Назва звички</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) =>
                setFormData({ ...formData, name: text })
              }
              placeholder="Назва звички"
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Категорія</Text>
            <View style={styles.categoryButtons}>
              {["спорт", "сон", "харчування", "інше"].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryBtn,
                    formData.category === cat && styles.categoryBtnActive,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, category: cat })
                  }
                >
                  <Text
                    style={[
                      styles.categoryBtnText,
                      formData.category === cat &&
                        styles.categoryBtnTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ціль (днів)</Text>
            <TextInput
              style={styles.input}
              value={formData.repeatCount.toString()}
              onChangeText={(text) =>
                setFormData({
                  ...formData,
                  repeatCount: parseInt(text) || 0,
                })
              }
              keyboardType="number-pad"
              placeholder="7"
            />
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Поточна серія</Text>
              <Text style={styles.statValue}>{habit?.repeatCount || 0}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Статус</Text>
              <Text style={styles.statusBadge}>Активна</Text>
            </View>
          </View>
        </Glass>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.btnSave, loading && styles.btnDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.btnText}>💾 Зберегти</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnCancel]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.btnCancelText}>Назад</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnDelete]}
            onPress={handleDelete}
            disabled={loading}
          >
            <Text style={styles.btnDeleteText}>🗑️ Видалити</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 20,
    marginTop: 8,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
  },
  section: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: colors.neon,
    fontSize: 14,
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
  categoryButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryBtn: {
    flex: 0.45,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(0, 255, 136, 0.3)",
    backgroundColor: "rgba(0, 255, 136, 0.05)",
    alignItems: "center",
  },
  categoryBtnActive: {
    backgroundColor: colors.neon,
    borderColor: colors.neon,
  },
  categoryBtnText: {
    color: "#aaa",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  categoryBtnTextActive: {
    color: "#000",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  statLabel: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: colors.neon,
    fontSize: 22,
    fontWeight: "bold",
  },
  statusBadge: {
    color: "#4caf50",
    fontSize: 14,
    fontWeight: "bold",
  },
  actions: {
    gap: 10,
    marginBottom: 30,
  },
  btn: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  btnSave: {
    backgroundColor: colors.neon,
  },
  btnCancel: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "#aaa",
  },
  btnDelete: {
    backgroundColor: "rgba(255, 100, 100, 0.1)",
    borderWidth: 2,
    borderColor: "#ff6464",
  },
  btnText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  btnCancelText: {
    color: "#aaa",
    fontWeight: "bold",
    fontSize: 16,
  },
  btnDeleteText: {
    color: "#ff6464",
    fontWeight: "bold",
    fontSize: 16,
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
