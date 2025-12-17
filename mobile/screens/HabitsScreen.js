import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Picker,
  ScrollView,
} from "react-native";
import Glass from "../components/Glass";
import { colors } from "../theme";
import apiService from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function HabitsScreen({ navigation }) {
  const authContext = useContext(AuthContext);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [selectedHabitForNote, setSelectedHabitForNote] = useState(null);
  const [noteText, setNoteText] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "спорт",
    note: "",
    repeatCount: 1,
    goal: 7,
    isComplex: false,
  });

  useEffect(() => {
    if (authContext.user?.userId) {
      loadHabits();
    }
  }, [authContext.user?.userId]);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const user = authContext.user;
      if (!user || !user.userId) {
        Alert.alert("Помилка", "Користувач не авторизований");
        return;
      }
      const data = await apiService.getHabitsByUser(user.userId);
      setHabits(data || []);
    } catch (error) {
      Alert.alert("Помилка", "Не вдалося завантажити звички");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (habit = null) => {
    if (habit) {
      setEditingHabit(habit);
      setFormData({
        name: habit.name,
        category: habit.category,
        note: habit.note || "",
        repeatCount: habit.repeatCount || 1,
        goal: habit.goal || 7,
        isComplex: (habit.repeatCount || 1) > 1,
      });
    } else {
      setEditingHabit(null);
      setFormData({
        name: "",
        category: "спорт",
        note: "",
        repeatCount: 1,
        goal: 7,
        isComplex: false,
      });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingHabit(null);
  };

  const saveHabit = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Помилка", "Введіть назву звички");
      return;
    }

    try {
      const user = authContext.user;
      if (!user || !user.userId) {
        Alert.alert("Помилка", "Користувач не авторизований");
        return;
      }

      const habitData = {
        userId: user.userId,
        name: formData.name.trim(),
        category: formData.category,
        note: formData.note || "",
        repeatCount: formData.isComplex ? formData.repeatCount : 1,
      };

      if (editingHabit) {
        await apiService.updateHabit(editingHabit.habitId, habitData);
        Alert.alert("Успіх", "Звичку оновлено");
      } else {
        await apiService.createHabit(habitData);
        Alert.alert("Успіх", "Звичку додано");
      }
      closeModal();
      loadHabits();
    } catch (error) {
      Alert.alert("Помилка", "Не вдалося зберегти звичку");
      console.error(error);
    }
  };

  const deleteHabit = (habitId) => {
    Alert.alert(
      "Видалити звичку?",
      "Ця дія необоротна",
      [
        { text: "Скасувати", onPress: () => {} },
        {
          text: "Видалити",
          onPress: async () => {
            try {
              const user = authContext.user;
              if (!user || !user.userId) {
                Alert.alert("Помилка", "Користувач не авторизований");
                return;
              }
              await apiService.deleteHabit(habitId, user.userId);
              loadHabits();
              Alert.alert("Успіх", "Звичку видалено");
            } catch (error) {
              Alert.alert("Помилка", "Не вдалося видалити звичку");
            }
          },
        },
      ]
    );
  };

  const completeHabit = async (habitId) => {
    try {
      const user = authContext.user;
      if (!user || !user.userId) {
        Alert.alert("Помилка", "Користувач не авторизований");
        return;
      }
      const data = await apiService.completeHabit(habitId, user.userId);
      Alert.alert("Успіх", `✅ Звичка виконана! Streak: ${data.streak} днів`);
      loadHabits();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Не вдалося відмітити звичку";
      Alert.alert("Помилка", errorMessage);
    }
  };

  const archiveHabit = async (habitId) => {
    Alert.alert(
      "Архівувати звичку?",
      "Звичку буде переміщено в архів",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Архівувати",
          onPress: async () => {
            try {
              const user = authContext.user;
              if (!user || !user.userId) {
                Alert.alert("Помилка", "Користувач не авторизований");
                return;
              }
              await apiService.archiveHabit(habitId, user.userId);
              Alert.alert("Успіх", "Звичку архівовано");
              loadHabits();
            } catch (error) {
              Alert.alert("Помилка", "Не вдалося архівувати звичку");
            }
          },
        },
      ]
    );
  };

  const openNoteModal = (habit) => {
    setSelectedHabitForNote(habit);
    setNoteText(habit.note || "");
    setNoteModalVisible(true);
  };

  const saveNote = async () => {
    if (!selectedHabitForNote) return;

    try {
      const user = authContext.user;
      if (!user || !user.userId) {
        Alert.alert("Помилка", "Користувач не авторизований");
        return;
      }

      await apiService.updateHabit(selectedHabitForNote.habitId, {
        userId: user.userId,
        name: selectedHabitForNote.name,
        category: selectedHabitForNote.category,
        note: noteText,
        repeatCount: selectedHabitForNote.repeatCount || 1,
      });

      Alert.alert("Успіх", "Нотатку збережено");
      setNoteModalVisible(false);
      loadHabits();
    } catch (error) {
      Alert.alert("Помилка", "Не вдалося зберегти нотатку");
    }
  };

  const filteredHabits = selectedCategory === "all"
    ? habits
    : habits.filter((h) => h.category === selectedCategory);

  const renderHabitItem = ({ item }) => (
    <Glass style={styles.habitItem}>
      <View style={styles.habitHeader}>
        <View style={styles.habitInfo}>
          <Text style={styles.habitName}>{item.name}</Text>
          <Text style={styles.habitCategory}>{item.category}</Text>
          {item.repeatCount > 1 && (
            <Text style={styles.repeatInfo}>
              🔁 Повторень: {item.repeatCount} раз(и) на день
            </Text>
          )}
          {item.note ? (
            <Text style={styles.notePreview} numberOfLines={2}>
              📝 {item.note}
            </Text>
          ) : null}
          <Text style={styles.completionInfo}>
            Виконано: {item.completionCount || 0} раз(и)
          </Text>
        </View>
        <Text style={styles.habitStreak}>🔥 {item.streak || 0}</Text>
      </View>

      <View style={styles.habitActions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.completBtn]}
          onPress={() => completeHabit(item.habitId)}
        >
          <Text style={styles.actionBtnText}>✅ Виконано</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.noteBtn]}
          onPress={() => openNoteModal(item)}
        >
          <Text style={styles.actionBtnText}>📝</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => openModal(item)}
        >
          <Text style={styles.actionBtnText}>✏️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.archiveBtn]}
          onPress={() => archiveHabit(item.habitId)}
        >
          <Text style={styles.actionBtnText}>📦</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => deleteHabit(item.habitId)}
        >
          <Text style={styles.actionBtnText}>🗑️</Text>
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
        <Text style={styles.title}>Мої звички</Text>
        <Text style={styles.subtitle}>Керуйте своїми звичками</Text>
      </View>

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => openModal()}
      >
        <Text style={styles.addBtnText}>➕ Додати звичку</Text>
      </TouchableOpacity>

      {habits.length > 0 && (
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Категорія:</Text>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={setSelectedCategory}
            style={styles.picker}
          >
            <Picker.Item label="Усі" value="all" />
            <Picker.Item label="Сон" value="сон" />
            <Picker.Item label="Спорт" value="спорт" />
            <Picker.Item label="Харчування" value="харчування" />
            <Picker.Item label="Інше" value="інше" />
          </Picker>
        </View>
      )}

      {filteredHabits.length === 0 ? (
        <Glass style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📝</Text>
          <Text style={styles.emptyStateText}>
            {habits.length === 0
              ? "У вас немає звичок"
              : "Немає звичок в цій категорії"}
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {habits.length === 0
              ? "Додайте першу звичку, щоб почати"
              : "Спробуйте іншу категорію"}
          </Text>
        </Glass>
      ) : (
        <FlatList
          data={filteredHabits}
          renderItem={renderHabitItem}
          keyExtractor={(item) => item.habitId.toString()}
          contentContainerStyle={styles.list}
          scrollEnabled={false}
        />
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Glass style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingHabit ? "Редагування звички" : "Нова звичка"}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Назва</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Назва звички"
                  placeholderTextColor="#888"
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Категорія</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="Спорт" value="спорт" />
                    <Picker.Item label="Сон" value="сон" />
                    <Picker.Item label="Харчування" value="харчування" />
                    <Picker.Item label="Інше" value="інше" />
                  </Picker>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Нотатка (опційно)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Додаткова інформація про звичку..."
                  placeholderTextColor="#888"
                  value={formData.note}
                  onChangeText={(text) =>
                    setFormData({ ...formData, note: text })
                  }
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formGroup}>
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() =>
                      setFormData({
                        ...formData,
                        isComplex: !formData.isComplex,
                      })
                    }
                  >
                    <Text style={styles.checkboxText}>
                      {formData.isComplex ? "☑️" : "☐"}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.checkboxLabel}>
                    Складна звичка (кілька разів на день)
                  </Text>
                </View>
              </View>

              {formData.isComplex && (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    Кількість виконань на день
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="1"
                    placeholderTextColor="#888"
                    keyboardType="number-pad"
                    value={formData.repeatCount.toString()}
                    onChangeText={(text) =>
                      setFormData({
                        ...formData,
                        repeatCount: parseInt(text) || 1,
                      })
                    }
                  />
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.btn, styles.btnCancel]}
                  onPress={closeModal}
                >
                  <Text style={styles.btnCancelText}>Скасувати</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, styles.btnSave]}
                  onPress={saveHabit}
                >
                  <Text style={styles.btnSaveText}>
                    {editingHabit ? "Оновити" : "Додати"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Glass>
        </View>
      </Modal>

      <Modal
        visible={noteModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setNoteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Glass style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Нотатка до звички: {selectedHabitForNote?.name}
              </Text>
              <TouchableOpacity onPress={() => setNoteModalVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Опиши свої думки, прогрес або настрій..."
              placeholderTextColor="#888"
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={5}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, styles.btnCancel]}
                onPress={() => setNoteModalVisible(false)}
              >
                <Text style={styles.btnCancelText}>Закрити</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.btnSave]}
                onPress={saveNote}
              >
                <Text style={styles.btnSaveText}>💾 Зберегти</Text>
              </TouchableOpacity>
            </View>
          </Glass>
        </View>
      </Modal>
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
  addBtn: {
    backgroundColor: colors.neon,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  addBtnText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  },
  habitStreak: {
    color: colors.neon,
    fontSize: 20,
    fontWeight: "bold",
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
  completBtn: {
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    borderColor: colors.neon,
  },
  editBtn: {
    backgroundColor: "rgba(100, 150, 255, 0.1)",
    borderColor: "#6496ff",
  },
  noteBtn: {
    backgroundColor: "rgba(255, 200, 100, 0.1)",
    borderColor: "#ffc864",
  },
  archiveBtn: {
    backgroundColor: "rgba(150, 100, 255, 0.1)",
    borderColor: "#9664ff",
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
  },
  closeBtn: {
    color: "#aaa",
    fontSize: 28,
  },
  modalForm: {
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
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
  pickerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 136, 0.2)",
    borderRadius: 10,
    overflow: "hidden",
  },
  picker: {
    color: colors.text,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnCancel: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "#aaa",
  },
  btnCancelText: {
    color: "#aaa",
    fontWeight: "bold",
  },
  btnSave: {
    backgroundColor: colors.neon,
  },
  btnSaveText: {
    color: "#000",
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  filterLabel: {
    color: colors.neon,
    fontSize: 14,
    fontWeight: "600",
    marginRight: 12,
  },
  repeatInfo: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 4,
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
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxText: {
    fontSize: 20,
  },
  checkboxLabel: {
    color: colors.text,
    fontSize: 14,
    flex: 1,
  },
});
