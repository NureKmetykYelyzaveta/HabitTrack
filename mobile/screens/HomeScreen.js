import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Glass from "../components/Glass";
import { colors } from "../theme";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Привіт! 👋</Text>
          <Text style={styles.subGreeting}>Давай досягнемо цілей разом</Text>
        </View>

        <Glass style={styles.hero}>
          <Text style={styles.title}>Контролюй звички</Text>
          <Text style={styles.subtitle}>
            HabitTrack допомагає формувати корисні ритуали та досягати цілей щодня.
          </Text>
          <TouchableOpacity
            style={styles.btnFill}
            onPress={() => navigation.navigate("Habits")}
          >
            <Text style={styles.btnText}>📝 Мої звички</Text>
          </TouchableOpacity>
        </Glass>

        <View style={styles.statsGrid}>
          <Glass style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statLabel}>Поточний стрік</Text>
            <Text style={styles.statValue}>0 днів</Text>
          </Glass>
          <Glass style={styles.statCard}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statLabel}>Завершено</Text>
            <Text style={styles.statValue}>0%</Text>
          </Glass>
          <Glass style={styles.statCard}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statLabel}>Баланс</Text>
            <Text style={styles.statValue}>0 ₽</Text>
          </Glass>
          <Glass style={styles.statCard}>
            <Text style={styles.statIcon}>📅</Text>
            <Text style={styles.statLabel}>Всього днів</Text>
            <Text style={styles.statValue}>0 днів</Text>
          </Glass>
        </View>

        <Glass style={styles.section}>
          <Text style={styles.sectionTitle}>Можливості</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✅</Text>
              <Text style={styles.featureText}>Планування звичок</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📈</Text>
              <Text style={styles.featureText}>Аналітика прогресу</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎯</Text>
              <Text style={styles.featureText}>Постановка цілей</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💾</Text>
              <Text style={styles.featureText}>Архівування звичок</Text>
            </View>
          </View>
        </Glass>

        <View style={styles.navButtons}>
          <TouchableOpacity
            style={[styles.navBtn, styles.navBtnPrimary]}
            onPress={() => navigation.navigate("Stats")}
          >
            <Text style={styles.navBtnText}>📊 Статистика</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navBtn, styles.navBtnSecondary]}
            onPress={() => navigation.navigate("Archive")}
          >
            <Text style={styles.navBtnText}>📦 Архів</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navBtn, styles.navBtnSecondary]}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.navBtnText}>👤 Профіль</Text>
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
    marginBottom: 24,
    marginTop: 8,
  },
  greeting: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subGreeting: {
    color: "#bbb",
    fontSize: 16,
  },
  hero: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 20,
  },
  title: {
    color: colors.neon,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#bbb",
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 8,
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
    fontSize: 20,
    fontWeight: "bold",
  },
  section: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.neon,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    color: colors.text,
    fontSize: 16,
  },
  navButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
  },
  navBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
  },
  navBtnPrimary: {
    backgroundColor: colors.neon,
    borderColor: colors.neon,
  },
  navBtnSecondary: {
    backgroundColor: "transparent",
    borderColor: colors.neon,
  },
  navBtnText: {
    fontWeight: "bold",
    fontSize: 14,
    color: colors.neon,
  },
});
