import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';


const UserChat = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const { roomId, userId } = route.params; // Pass roomId and userId from navigation
  const ws = new WebSocket("ws://192.168.18.36:8080"); // Replace with your server URL

  useEffect(() => {
    // Connect to WebSocket and join the room
    socket.emit('joinRoom', roomId);

    // Listen for incoming messages
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (text.trim()) {
      const message = { sender: userId, text, timestamp: new Date() };
      socket.emit('sendMessage', { roomId, message });
      setMessages((prevMessages) => [...prevMessages, message]);
      setText('');
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === userId ? styles.userMessage : styles.driverMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  messagesList: { padding: 10 },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6' },
  driverMessage: { alignSelf: 'flex-start', backgroundColor: '#ECECEC' },
  messageText: { fontSize: 16 },
  timestamp: { fontSize: 10, color: '#888', marginTop: 5 },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  sendButtonText: { color: '#fff', fontSize: 16 },
});

export default ChatScreen;
