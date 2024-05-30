// src/Teacher/Screens/EditMarksScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

const EditMarksScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { subject, obtainedMarks, totalMarks } = route.params;

  const [marks, setMarks] = useState(obtainedMarks);



  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={() => navigation.goBack()}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.header}>Edit Marks for {subject}</Text>
          <TextInput
            style={styles.input}
            value={marks.toString()}
            onChangeText={setMarks}
            keyboardType="numeric"
          />
          <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={handleSave} style={styles.saveButton} >
          Save
        </Button>
        <Button mode="contained" onPress={handleDelete} style={styles.saveButton} >
          Delete
        </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 30,
    backgroundColor:'#475D8C',
    borderRadius: 15,
    width:100,
   
  },
});

export default EditMarksScreen;
