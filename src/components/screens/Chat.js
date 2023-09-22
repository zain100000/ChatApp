import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import ChatHeader from '../Navigation/ChatHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Chat = ({route, navigation}) => {
  const {selectedUser} = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = auth().currentUser;

  const formatTimestamp = timestamp => {
    const date = new Date(timestamp);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const senderChatRef = database().ref(
      `chats/${currentUser.uid}/${selectedUser.uid}`,
    );
    const receiverChatRef = database().ref(
      `chats/${selectedUser.uid}/${currentUser.uid}`,
    );

    senderChatRef
      .orderByChild('timestamp') // Order by timestamp
      .on(
        'value',
        snapshot => {
          handleSnapshot(snapshot);
        },
        error => {
          console.error('Error fetching sender data:', error);
          setIsLoading(false);
        },
      );

    receiverChatRef
      .orderByChild('timestamp') // Order by timestamp
      .on(
        'value',
        snapshot => {
          handleSnapshot(snapshot);
        },
        error => {
          console.error('Error fetching receiver data:', error);
          setIsLoading(false);
        },
      );

    return () => {
      senderChatRef.off('value');
      receiverChatRef.off('value');
    };
  }, [currentUser, selectedUser]);

  const handleSnapshot = snapshot => {
    if (snapshot.exists()) {
      const messagesData = snapshot.val();
      console.log('Messages data:', messagesData);

      if (messagesData) {
        const messagesArray = Object.values(messagesData).sort(
          (a, b) => a.timestamp - b.timestamp,
        ); // Sort by timestamp
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
    } else {
      console.log('No data found at the specified path.');
      setMessages([]);
    }

    // Set loading to false once data is loaded
    setIsLoading(false);
  };

  const sendMessage = () => {
    if (message.trim() !== '') {
      const timestamp = Date.now();
      const messageData = {
        text: message,
        sender: currentUser.uid,
        timestamp,
      };

      // Debugging: Check if messageData is correct
      console.log('Message Data:', messageData);

      // Save the message to Firebase Realtime Database with error handling
      const senderMessageRef = database().ref(
        `chats/${currentUser.uid}/${selectedUser.uid}/${timestamp}`,
      );
      const receiverMessageRef = database().ref(
        `chats/${selectedUser.uid}/${currentUser.uid}/${timestamp}`,
      );

      senderMessageRef
        .set(messageData)
        .then(() => {
          console.log('Message sent successfully to sender.');
          setMessage('');
        })
        .catch(error => {
          console.error('Error sending message to sender:', error);
        });

      receiverMessageRef
        .set(messageData)
        .then(() => {
          console.log('Message sent successfully to receiver.');
          // You can add logic here to update the receiver's UI if needed.
        })
        .catch(error => {
          console.error('Error sending message to receiver:', error);
        });
    }
  };

  return (
    <View className="flex-1">
      <View>
        <ChatHeader selectedUser={selectedUser} navigation={navigation} />
      </View>
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <Text className=" text-black">Loading...</Text>
        </View>
      ) : messages.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className=" text-black">No messages in this chat.</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={item => item.timestamp.toString()}
          renderItem={({item}) => (
            <View
              className={`p-2 ${
                item.sender === currentUser.uid
                  ? 'self-end bg-blue-500'
                  : 'self-start bg-green-500'
              } rounded-lg mt-2 mx-2`}>
              <Text style="text-white">{item.text}</Text>
              <Text style="color: gray; font-size: 12px; margin-top: 4px">
                {formatTimestamp(item.timestamp)}
              </Text>
            </View>
          )}
        />
      )}
      <View className="flex-row justify-around items-center mb-2">
        <TextInput
          className="flex-1 px-6 py-2 border border-gray-500 rounded-full text-black"
          placeholder="Type your message"
          placeholderTextColor={'#000'}
          value={message}
          onChangeText={text => setMessage(text)}
        />
        <TouchableOpacity
          onPress={sendMessage}
          className="px-2 py-2 rounded-full">
          <MaterialCommunityIcons
            name="send-circle"
            color={'#9400FF'}
            size={40}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chat;
