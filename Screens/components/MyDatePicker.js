import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { IconButton, TextInput } from 'react-native-paper';

const MyDatePicker = ({ date, onDateChange, label }) => {
  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date || new Date(),
      onChange: (event, selectedDate) => {
        const currentDate = selectedDate || date;
        onDateChange(currentDate);
      },
      mode: currentMode,
      is24Hour: true,
   
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  return (
    <View style={styles.container}>

      <TextInput
            label={label}
            value={date ? date.toDateString() : ''}
            style={styles.input}
            editable={false}
            right={
              <TextInput.Icon
              icon="calendar"
              size={26}
              onPress={showDatepicker}
              style={styles.iconButton}
              />
            }
        />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#E2E2E2',
    width:'100%'
  },
  iconButton: {
    marginLeft: -15, // Adjust to position the button correctly
    backgroundColor:  '#E2E2E2',

  },
});

export default MyDatePicker;
