import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
} from 'react-native';
import {database} from '../../../FirebaseConfig'; // Import your Firebase configuration

const ChatScreen = ({route}) => {
  const {contactName} = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const chatRoomId = `${contactName}-chat`; // Unique chat room ID for each contact

  useEffect(() => {
    // Set up a Firebase listener to retrieve messages for this chat room
    const chatRef = database.ref(`chats/${chatRoomId}`);

    chatRef.on('value', snapshot => {
      const messageData = snapshot.val();
      if (messageData) {
        const messageList = Object.values(messageData);
        setMessages(messageList);
      } else {
        setMessages([]);
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      chatRef.off('value');
    };
  }, [chatRoomId]);

  const sendMessage = () => {
    if (newMessage.trim() === '') {
      return;
    }

    const newMessageData = {
      sender: 'You', // You can replace this with the actual sender's name or ID
      content: newMessage,
      timestamp: new Date().getTime(),
    };

    // Push the new message to the chat room in the database
    database.ref(`chats/${chatRoomId}`).push(newMessageData);

    // Clear the input field
    setNewMessage('');
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={messages}
        keyExtractor={item => item.timestamp.toString()}
        renderItem={({item}) => (
          <View style={{padding: 10}}>
            <Text>
              {item.sender}: {item.content}
            </Text>
          </View>
        )}
      />
      <View
        style={{flexDirection: 'row', alignItems: 'center', borderTopWidth: 1}}>
        <TextInput
          placeholder="Type your message..."
          onChangeText={text => setNewMessage(text)}
          value={newMessage}
          style={{flex: 1, padding: 10}}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

export default ChatScreen;
