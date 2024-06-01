//Javeria
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, Alert,DrawerLayoutAndroid } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Searchbar, Drawer, Appbar } from 'react-native-paper';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import { firestore, auth } from '../../../firebaseConfig';

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const { teacherClass, className } = route.params;
  const [active, setActive] = useState(null);
  const drawer = useRef(null);

  useFocusEffect(
    useCallback(() => {
      setActive(null); // Reset active state when this screen is focused
      // navigation.navigate('Home',{ teacherClass: teacherClass, className });
    }, [])
  );

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const cls = 'class' + className;
        const classRef = doc(firestore, 'Classes', cls);

        const q = query(collection(firestore, 'students'), where('class', '==', classRef));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log('No matching documents.');
          return;
        }

        const studentsList = querySnapshot.docs.map(docSnapshot => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        }));

        console.log(`Fetched ${studentsList.length} students`);
        setStudents(studentsList);
        setFilteredStudents(studentsList);
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

  const onChangeSearch = query => {
    setSearchQuery(query);
  };

  const drawerContent = () => (
    <View style={{ flex: 1, padding: 20 }}>
      <Drawer.Section title="Dashboard">
        <Drawer.Item
          label="Logout"
          active={active === 'Logout'}
          onPress={handleLogout}
          style={styles.logout}
        />
      </Drawer.Section>
    </View>
  );

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainLogin' }],
      });
    }).catch(error => {
      Alert.alert('Error', error.message);
    });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate('StudentDetail', { studentId: item.id })}
    >
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.registrationNumber}</Text>
      <Text style={styles.cell}>{item.fatherName}</Text>
    </TouchableOpacity>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition="left"
      renderNavigationView={drawerContent}
    >
      <Appbar.Header style={{ backgroundColor: '#f8f9fa' }}>
        <Appbar.Action icon="menu" onPress={() => drawer.current.openDrawer()} />
        <Appbar.Content title="Teacher's Console" />
      </Appbar.Header>
      <StatusBar backgroundColor="#475D8C" barStyle="light-content" />
      <View style={styles.container}>
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
    </DrawerLayoutAndroid>
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
  Searchbar: {
    backgroundColor: '#E2E2E2',
    borderRadius: 20,
    marginBottom: 15,
  },
  logout: {
    borderRadius: 15,
    color: '#6C85A6',
    backgroundColor: '#C7CFD9',
    height: 50,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 200,
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
