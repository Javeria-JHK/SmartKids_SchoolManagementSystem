//Ayesha

import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Button, Provider as PaperProvider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const MainLoginScreen = () => {
  const navigation = useNavigation();



  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.schoolName}>Smart Kids</Text>
        <Text style={styles.slogan}>A place to grow and learn</Text>
        <Image
          source={require('../public/school.png')}
          style={styles.image}
        />
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() =>  navigation.navigate('AdminLoginScreen')}
            style={styles.loginButton}
            labelStyle={styles.buttonText}
          >
            Administrator Login
          </Button>
          <Button
            mode="contained"
            onPress={() =>  navigation.navigate('TeacherLoginScreen')}
            style={styles.loginButton}
            labelStyle={styles.buttonText}
          >
            Teachers Console
          </Button>
          <Button
            mode="contained"
            onPress={() =>  navigation.navigate('StudentLoginScreen')}
            style={styles.loginButton}
            labelStyle={styles.buttonText}
          >
            Students Console
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  schoolName: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slogan: {
    fontSize: 18,
    marginBottom: 20,
  },
  image: {
    width: 370,
    height: 270,
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    marginTop: 20,
    width: '70%',
    height:40,
    borderRadius: 15,
    backgroundColor: '#475D8C',
  },
  buttonText: {
    fontSize: 18,
  },
});

export default MainLoginScreen;
