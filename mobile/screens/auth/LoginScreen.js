import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Glass from '../../components/Glass';
import { colors } from '../../theme';
import apiService from '../../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Помилка', 'Заповніть всі поля');
      return;
    }

    setLoading(true);
    try {
      await authContext.signIn(email, password);
    } catch (error) {
      Alert.alert('Помилка входу', error.message || 'Спробуйте ще раз');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>HabitTrack</Text>
          <Text style={styles.tagline}>Контролюй звички. Створюй кращі дні.</Text>
        </View>

        <Glass style={styles.formContainer}>
          <Text style={styles.title}>Вхід</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Пароль</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.btn, styles.btnFill, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.btnText}>Увійти</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>або</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={[styles.btn, styles.btnOutline]}
            onPress={() => navigation.navigate('Register')}
            disabled={loading}
          >
            <Text style={styles.btnOutlineText}>Створити акаунт</Text>
          </TouchableOpacity>
        </Glass>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Потребуємо допомогу? Напишіть нам!
          </Text>
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
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    color: colors.neon,
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tagline: {
    color: '#bbb',
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    padding: 20,
    borderRadius: 20,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: colors.neon,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
    color: colors.text,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  btn: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  btnFill: {
    backgroundColor: colors.neon,
  },
  btnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
  },
  dividerText: {
    color: '#888',
    marginHorizontal: 10,
  },
  btnOutline: {
    borderWidth: 2,
    borderColor: colors.neon,
  },
  btnOutlineText: {
    color: colors.neon,
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#888',
    fontSize: 14,
  },
});
