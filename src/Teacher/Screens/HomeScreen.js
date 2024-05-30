// src/Teacher/Screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity,TouchableWithoutFeedback, StyleSheet, StatusBar, Keyboard } from 'react-native';
import { useNavigation , useRoute } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';






  const HomeScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const { teacherClass, className } = route.params;

    
  

    useEffect(() => {
      const fetchStudents = async () => {
        try {
          const cls = 'class'+className;
          const classRef = doc(firestore, 'Classes', cls); // Update with the correct reference path
   
          const q = query(collection(firestore, 'students'), where('class', '==', classRef));
          const querySnapshot = await getDocs(q);
  
          if (querySnapshot.empty) {
            console.log('No matching documents.');
            return;
          }
  
          const studentsList = querySnapshot.docs.map(docSnapshot => ({
            id: docSnapshot.id,
            ...docSnapshot.data()
          }));
  
          console.log(`Fetched ${studentsList.length} students`);
          setStudents(studentsList);
          setFilteredStudents(studentsList); // Initialize filteredStudents with all students
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      };
  
      fetchStudents();
    }, [teacherClass]);
  
    useEffect(() => {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.registrationNumber.toString().includes(searchQuery)
      );
      setFilteredStudents(filtered);

    }, [searchQuery, students]);
  
    const onChangeSearch = (query) => {
      setSearchQuery(query);
    };
  
    const renderItem = ({ item, index }) => (
      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate('StudentDetail' , { studentId: item.id })}
      >
        <Text style={styles.cell}>{index + 1}</Text>
        <Text style={styles.cell}>{item.name}</Text>
        <Text style={styles.cell}>{item.registrationNumber}</Text>
        <Text style={styles.cell}>{item.fatherName}</Text>
      </TouchableOpacity>
    );
  
    return (
      <TouchableWithoutFeedback >
      <View style={styles.container} >
        <StatusBar backgroundColor="#475D8C" barStyle="light-content" />
        <Text style={styles.header}>Class {className} Students</Text>
        <Searchbar 
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={[styles.Searchbar, styles.shadow]}
    
        />
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>S.No</Text>
            <Text style={styles.headerCell}>Name</Text>
            <Text style={styles.headerCell}>Roll Number</Text>
            <Text style={styles.headerCell}>Father's Name</Text>
          </View>
          <FlatList
            data={filteredStudents}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
      </TouchableWithoutFeedback>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  
  },
  Searchbar:{
    backgroundColor: '#E2E2E2',
    borderRadius:20,
    marginBottom:15.
   

  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom:200,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#6C85A6',
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
});

export default HomeScreen;
