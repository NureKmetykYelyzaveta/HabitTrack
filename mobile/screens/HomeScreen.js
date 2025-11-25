import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Glass from "../components/Glass";
import { colors } from "../theme";

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.logo}>HabitTrack</Text>

      <Glass style={styles.hero}>
        <Text style={styles.title}>Контролюй звички. Створюй кращі дні.</Text>
        <Text style={styles.subtitle}>
          HabitTrack допомагає формувати корисні ритуали та досягати цілей.
        </Text>

        <TouchableOpacity
          style={styles.btnFill}
          onPress={() => navigation.navigate("Habits")}
        >
          <Text style={styles.btnText}>Почати зараз</Text>
        </TouchableOpacity>
      </Glass>

      <Glass style={styles.section}>
        <Text style={styles.sectionTitle}>Про HabitTrack</Text>
        <Text style={styles.sectionText}>
          Легко відстежуй щоденні звички, плануй завдання і насолоджуйся
          процесом вдосконалення.
        </Text>
      </Glass>

      <Glass style={styles.section}>
        <Text style={styles.sectionTitle}>Що пропонує HabitTrack</Text>
        <Text style={styles.sectionText}>📅 Плануй звички</Text>
        <Text style={styles.sectionText}>📊 Аналітика</Text>
        <Text style={styles.sectionText}>🌙 Баланс</Text>
        <Text style={styles.sectionText}>🔔 Нагадування</Text>
      </Glass>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 20,
  },
  logo: {
    color: colors.neon,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  hero: {
    marginBottom: 20,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#bbb",
    fontSize: 16,
    marginBottom: 20,
  },
  btnFill: {
    backgroundColor: colors.neon,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.neon,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionText: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 4,
  },
});
