import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Glass from "../components/Glass";
import { colors } from "../theme";

export default function HabitsScreen() {
  const [habit, setHabit] = useState("");
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    const data = await AsyncStorage.getItem("habits");
    if (data) setHabits(JSON.parse(data));
  };

  const saveHabits = async (newList) => {
    setHabits(newList);
    await AsyncStorage.setItem("habits", JSON.stringify(newList));
  };

  const addHabit = () => {
    if (!habit.trim()) return;
    const newList = [...habits, { id: Date.now(), text: habit, done: false }];
    saveHabits(newList);
    setHabit("");
  };

  const toggleHabit = (id) => {
    const newList = habits.map((h) =>
      h.id === id ? { ...h, done: !h.done } : h
    );
    saveHabits(newList);
  };

  const deleteHabit = (id) => {
    const newList = habits.filter((h) => h.id !== id);
    saveHabits(newList);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Мої звички</Text>

      <Glass style={styles.inputBox}>
        <TextInput
          placeholder="Нова звичка..."
          placeholderTextColor="#888"
          value={habit}
          onChangeText={setHabit}
          style={styles.input}
        />

        <TouchableOpacity style={styles.btnAdd} onPress={addHabit}>
          <Text style={styles.btnAddText}>Додати</Text>
        </TouchableOpacity>
      </Glass>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Glass style={styles.habitItem}>
            <TouchableOpacity onPress={() => toggleHabit(item.id)}>
              <Text
                style={[
                  styles.habitText,
                  item.done && {
                    textDecorationLine: "line-through",
                    color: colors.neon,
                  },
                ]}
              >
                {item.text}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteHabit(item.id)}>
              <Text style={styles.delete}>✖</Text>
            </TouchableOpacity>
          </Glass>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 20,
  },
  header: {
    color: colors.neon,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  btnAdd: {
    backgroundColor: colors.neon,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  btnAddText: {
    color: "#000",
    fontWeight: "bold",
  },
  habitItem: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  habitText: {
    color: colors.text,
    fontSize: 18,
  },
  delete: {
    color: "#ff5555",
    fontSize: 20,
  },
});
