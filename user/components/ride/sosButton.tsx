import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import call from 'react-native-phone-call'; // Properly import the module

const SOSButton: React.FC = () => {
  const handleSOS = () => {
    Alert.alert(
      'Emergency Call',
      'Are you sure you want to make an emergency call?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call',
          onPress: () => {
            const args = {
              number: '112', // Replace with your emergency number
              prompt: true,  // Show a prompt before calling
            };
            try {
              call(args); // Trigger the phone call
            } catch (error) {
              console.error('Call Error:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.buttonContainer}>
      <Button title="SOS" onPress={handleSOS} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 20,
    alignSelf: 'center',
  },
});

export default SOSButton;
