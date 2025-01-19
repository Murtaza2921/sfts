import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams } from "expo-router";
import { generateRoomId } from '@/utils/constants';

const ChatScreen: React.FC = () => {
  const { userId, driverId } = useLocalSearchParams();
  const roomId = generateRoomId('1', '3'); // Ensure dynamic IDs are used.
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const ws = useRef<WebSocket | null>(null);
  const flatListRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    ws.current = new WebSocket('ws://192.168.116.148:8080');
    const userId = '1';
    ws.current.onopen = () => {
      console.log('Connected to WebSocket');
      ws.current?.send(
        JSON.stringify({
          type: 'joinRoom',
          role: 'user',
          roomId,
          userId,
          driverId,
        })
      );
    };

    ws.current.onmessage = (event) => {
      const incomingMessage = JSON.parse(event.data);
      console.log("Received Message:", incomingMessage);
    
      if (incomingMessage.type === 'error') {
        console.error('WebSocket Error:', incomingMessage.message);
        return; // Stop further processing
      }
    
      if (incomingMessage.type === 'newMessage' && incomingMessage.roomId === roomId) {
        const transformedMessage = {
          ...incomingMessage,
          text: incomingMessage.text || incomingMessage.message, // Ensure `text` is always present
          role: incomingMessage.sender === userId ? 'user' : 'driver',
        };
        setMessages((prev) => [...prev, transformedMessage]);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.current?.close();
    };
  }, [roomId, userId, driverId]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const message = {
      roomId,
      sender: userId,
      receiver: driverId,
      text,
      timestamp: new Date().toISOString(),
    };

    try {
      ws.current?.send(JSON.stringify({ type: 'sendMessage', message }));
      setMessages((prev) => [...prev, { ...message, role: 'user' }]);
      setText('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View
      style={[
        styles.messageContainer,
        item.role === 'user' ? styles.userMessage : styles.driverMessage,
        item.role === 'user' ? styles.alignRight : styles.alignLeft,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );

  useEffect(() => {
    // Automatically scroll to the latest message
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <FlatList
          ref={flatListRef}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  messagesList: { padding: 10, flexGrow: 1, justifyContent: 'flex-end' },
  messageContainer: {
    maxWidth: '70%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
  },
  userMessage: {
    backgroundColor: '#DCF8C6',
    borderBottomRightRadius: 0,
  },
  driverMessage: {
    backgroundColor: '#ECECEC',
    borderBottomLeftRadius: 0,
  },
  alignLeft: { alignSelf: 'flex-start' },
  alignRight: { alignSelf: 'flex-end' },
  messageText: { fontSize: 16 },
  timestamp: { fontSize: 10, color: '#888', marginTop: 3 },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
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
