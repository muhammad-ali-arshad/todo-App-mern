const loginImg = require('../../assets/images/login.png');
import Button from '@/components/button';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState, useContext } from 'react';
import { useRouter } from 'expo-router';
import { login as loginService } from '@/services/auth.service';
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



const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await loginService(email, password);
      console.log('Login successful:', result);
      

      if (result.token) {
        await login(result.token);
        router.replace('/home');
      } else {
        setError('No token received from server');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    console.log('Navigate to Sign Up screen');
  	router.push('/signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image source={loginImg} style={styles.image} />
          
          <Text style={styles.title}>Login</Text>

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
		<View style={[styles.inputContainer, { marginBottom: 50 }]} >

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

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button text={isLoading ? "Logging in..." : "Login"} onPress={handleLogin} disabled={isLoading} />

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp} >
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </View>


        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

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
    transform: [{ rotate: '-5deg' }],
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
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  signUpText: {
    color: '#666',
    fontSize: 14,
  },
  signUpLink: {
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