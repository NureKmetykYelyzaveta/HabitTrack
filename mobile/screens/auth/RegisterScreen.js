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

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Помилка', 'Заповніть всі поля');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Помилка', 'Паролі не збігаються');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Помилка', 'Пароль має бути не менше 6 символів');
      return;
    }

    setLoading(true);
    try {
      await authContext.signUp(username, email, password);
    } catch (error) {
      Alert.alert('Помилка реєстрації', error.message || 'Спробуйте ще раз');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Створити акаунт</Text>
          <Text style={styles.subtitle}>Приєднайтесь до HabitTrack</Text>
        </View>

        <Glass style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ім'я користувача</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor="#888"
              value={username}
              onChangeText={setUsername}
              editable={!loading}
            />
          </View>

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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Підтвердити пароль</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.btn, styles.btnFill, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.btnText}>Реєструватися</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>або</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={[styles.btn, styles.btnOutline]}
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.btnOutlineText}>Вже маєш акаунт?</Text>
          </TouchableOpacity>
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
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#bbb',
    fontSize: 16,
  },
  formContainer: {
    padding: 20,
    borderRadius: 20,
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
    marginTop: 20,
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
});
