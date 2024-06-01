//Javeria
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

const AppHeader = ({ title }) => {
  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Content title={title} titleStyle={styles.title} />
      {/* Add more Appbar components here if needed */}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#475D8C', // Customize the background color
  },
  title: {
    color: '#fff', // Customize the title color
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AppHeader;
