import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Glass from "../components/Glass";
import { colors } from "../theme";
import apiService from "../services/api";

export default function StatsScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.getStats();
      setStats(response);
    } catch (error) {
      Alert.alert("Помилка", "Не вдалося завантажити статистику");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Статистика</Text>
          <Text style={styles.subtitle}>Ваш прогрес</Text>
        </View>

        <View style={styles.statsGrid}>
          <Glass style={styles.statCard}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statLabel}>Всього звичок</Text>
            <Text style={styles.statValue}>
              {stats?.totalHabits || 0}
            </Text>
          </Glass>

          <Glass style={styles.statCard}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statLabel}>Виконано сьогодні</Text>
            <Text style={styles.statValue}>
              {stats?.completedToday || 0}
            </Text>
          </Glass>

          <Glass style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statLabel}>Найбільший стрік</Text>
            <Text style={styles.statValue}>
              {stats?.longestStreak || 0} днів
            </Text>
          </Glass>

          <Glass style={styles.statCard}>
            <Text style={styles.statIcon}>💯</Text>
            <Text style={styles.statLabel}>Процент виконання</Text>
            <Text style={styles.statValue}>
              {stats?.completionRate || 0}%
            </Text>
          </Glass>
        </View>

        <Glass style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Аналіз</Text>
          <View style={styles.analysisItem}>
            <View style={styles.analysisHeader}>
              <Text style={styles.analysisLabel}>Сегодняшня активність</Text>
              <Text style={styles.analysisValue}>
                {stats?.completedToday || 0}/{stats?.totalHabits || 0}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      ((stats?.completedToday || 0) / (stats?.totalHabits || 1)) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>
          </View>
        </Glass>

        <Glass style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Категорії</Text>
          {stats?.byCategory?.length ? (
            stats.byCategory.map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>
                    {category.category}
                  </Text>
                  <Text style={styles.categoryCount}>
                    {category.count} звичок
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Немає даних</Text>
          )}
        </Glass>

        <Glass style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Поради</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>💪</Text>
            <Text style={styles.tipText}>
              Виконуйте звички щодня для найкращих результатів
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>🎯</Text>
            <Text style={styles.tipText}>
              Ставте реальні цілі і починайте з малого
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>📊</Text>
            <Text style={styles.tipText}>
              Переглядайте статистику для мотивації
            </Text>
          </View>
        </Glass>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    marginTop: 8,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    color: "#aaa",
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
    textAlign: "center",
  },
  statValue: {
    color: colors.neon,
    fontSize: 24,
    fontWeight: "bold",
  },
  section: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.neon,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  analysisItem: {
    marginBottom: 16,
  },
  analysisHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  analysisLabel: {
    color: colors.text,
    fontSize: 14,
  },
  analysisValue: {
    color: colors.neon,
    fontSize: 14,
    fontWeight: "bold",
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.neon,
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 255, 136, 0.1)",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  categoryCount: {
    color: colors.neon,
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyText: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 16,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 255, 136, 0.1)",
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  tipText: {
    color: colors.text,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});
