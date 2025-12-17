import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Glass from "../components/Glass";
import { colors } from "../theme";
import apiService from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function ArchiveScreen({ navigation }) {
  const authContext = useContext(AuthContext);
  const [archivedHabits, setArchivedHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authContext.user?.userId) {
      loadArchivedHabits();
    }
  }, [authContext.user?.userId]);

  const loadArchivedHabits = async () => {
    try {
      setLoading(true);
      const user = authContext.user;
      if (!user || !user.userId) {
        Alert.alert("Помилка", "Користувач не авторизований");
        return;
      }
      const data = await apiService.getArchivedHabits(user.userId);
      setArchivedHabits(data || []);
    } catch (error) {
      Alert.alert("Помилка", "Не вдалося завантажити архівовані звички");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const unarchiveHabit = async (habitId) => {
    Alert.alert(
      "Відновити звичку?",
      "Звичку буде повернено до активних",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Відновити",
          onPress: async () => {
            try {
              const user = authContext.user;
              if (!user || !user.userId) {
                Alert.alert("Помилка", "Користувач не авторизований");
                return;
              }
              await apiService.unarchiveHabit(habitId, user.userId);
              Alert.alert("Успіх", "Звичку відновлено");
              loadArchivedHabits();
            } catch (error) {
              Alert.alert("Помилка", "Не вдалося відновити звичку");
            }
          },
        },
      ]
    );
  };

  const deleteArchivedHabit = async (habitId) => {
    Alert.alert(
      "Видалити звичку?",
      "Ця дія необоротна",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          style: "destructive",
          onPress: async () => {
            try {
              const user = authContext.user;
              if (!user || !user.userId) {
                Alert.alert("Помилка", "Користувач не авторизований");
                return;
              }
              await apiService.deleteHabit(habitId, user.userId);
              Alert.alert("Успіх", "Звичку видалено");
              loadArchivedHabits();
            } catch (error) {
              Alert.alert("Помилка", "Не вдалося видалити звичку");
            }
          },
        },
      ]
    );
  };

  const renderHabitItem = ({ item }) => (
    <Glass style={styles.habitItem}>
      <View style={styles.habitHeader}>
        <View style={styles.habitInfo}>
          <Text style={styles.habitName}>{item.name}</Text>
          <Text style={styles.habitCategory}>{item.category}</Text>
          {item.note && (
            <Text style={styles.notePreview} numberOfLines={2}>
              📝 {item.note}
            </Text>
          )}
          <Text style={styles.completionInfo}>
            Виконано: {item.completionCount || 0} раз(и)
          </Text>
          <Text style={styles.streakInfo}>🔥 Streak: {item.streak || 0} днів</Text>
        </View>
      </View>

      <View style={styles.habitActions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.unarchiveBtn]}
          onPress={() => unarchiveHabit(item.habitId)}
        >
          <Text style={styles.actionBtnText}>↩️ Відновити</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => deleteArchivedHabit(item.habitId)}
        >
          <Text style={styles.actionBtnText}>🗑️ Видалити</Text>
        </TouchableOpacity>
      </View>
    </Glass>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.neon} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Архів звичок</Text>
        <Text style={styles.subtitle}>
          Переглядайте та керуйте архівованими звичками
        </Text>
      </View>

      {archivedHabits.length === 0 ? (
        <Glass style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📦</Text>
          <Text style={styles.emptyStateText}>Архів порожній</Text>
          <Text style={styles.emptyStateSubtext}>
            Тут будуть звички, які ви архівували
          </Text>
        </Glass>
      ) : (
        <FlatList
          data={archivedHabits}
          renderItem={renderHabitItem}
          keyExtractor={(item) => item.habitId.toString()}
          contentContainerStyle={styles.list}
          scrollEnabled={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 14,
  },
  list: {
    paddingBottom: 20,
  },
  habitItem: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  habitHeader: {
    marginBottom: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  habitCategory: {
    color: "#aaa",
    fontSize: 12,
    textTransform: "capitalize",
    marginBottom: 4,
  },
  notePreview: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
  completionInfo: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 4,
  },
  streakInfo: {
    color: colors.neon,
    fontSize: 14,
    marginTop: 4,
    fontWeight: "600",
  },
  habitActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  unarchiveBtn: {
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    borderColor: colors.neon,
  },
  deleteBtn: {
    backgroundColor: "rgba(255, 100, 100, 0.1)",
    borderColor: "#ff6464",
  },
  actionBtnText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyStateText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
  },
});

