import Button from '@/components/button';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState, useContext } from 'react';
import { useRouter } from 'expo-router';
import { signup as signupService } from '@/services/auth.service';
import { AuthContext } from '@/context/AuthContext';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const signUp = require('../../assets/images/signIn.png');


const Signup = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const handleSignUp = async () => {
    if (!userName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signupService(userName, email, password);
      console.log('Signup successful:', result);

      // Save token using AuthContext
      if (result.token) {
        await login(result.token);
        router.replace('/home');
      } else {
        setError('No token received from server');
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      setError(error?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const validatePasswords = () => {
  if (password !== confirmPassword) {
    setError('Passwords do not match');
    return false;
  }
  setError('');
  return true;
};

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image source={signUp} style={styles.image} />

          <Text style={styles.title}>Register</Text>

          {/* Username */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="person-outline" size={22} color="#0188ef" />
            <TextInput
              placeholder="Enter Username"
              value={userName}
              onChangeText={setUserName}
              style={styles.input}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="alternate-email" size={22} color="#0188ef" />
            <TextInput
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock-outline" size={22} color="#0188ef" />
            <TextInput
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry={hidePassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setHidePassword(!hidePassword)}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={hidePassword ? 'visibility-off' : 'visibility'}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock-outline" size={22} color="#0188ef" />
            <TextInput
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              secureTextEntry={hideConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={hideConfirmPassword ? 'visibility-off' : 'visibility'}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button text={isLoading ? "Registering..." : "Register"} onPress={handleSignUp} disabled={isLoading} />

          <View style={styles.loginContainer}>
             <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogin} activeOpacity={0.7}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  image: {
    width: 250,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 45,
    // transform: [{ rotate: '-5deg' }],
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 30,
    alignSelf: 'flex-start',
    color: '#222',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
    marginBottom: 24,
    width: '100%',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
    paddingVertical: 4,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
});