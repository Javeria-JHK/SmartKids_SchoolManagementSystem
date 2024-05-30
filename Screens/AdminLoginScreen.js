import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, TextInput, Button, Provider as PaperProvider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, firestore } from '../firebaseConfig';

const AdminLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const q = query(collection(firestore, 'admin'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setEmail("");
        setPassword("");
        navigation.navigate('AdminDashboard');
      } else {
        setError('No Authorization');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setError('Invalid Email or Password');
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>WELCOME!</Text>
        <Image
          source={require('../public/Admin.jpg')}
          style={styles.image}
        />
        <Text style={styles.loginText}>Administrator LogIn</Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={text => { setEmail(text); setError(""); }}
          style={styles.input}
          keyboardType="email-address"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            label="Password"
            value={password}
            onChangeText={text => { setPassword(text); setError(""); }}
            style={styles.input}
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye" : "eye-off"}
                size={24}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button mode="contained" onPress={handleLogin} style={styles.loginButton} labelStyle={styles.buttonText}>
          Log In
        </Button>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
  },
  errorText: {
    color: 'red'
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 250,
    marginBottom: 20,
  },
  loginText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#E2E2E2'
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButton: {
    marginTop: 20,
    width: '80%',
    borderRadius: 15,
    height: 50,
    backgroundColor: '#475D8C',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    flex: 1,
  },
});

export default AdminLoginScreen;
