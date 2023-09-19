import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import firebase from 'firebase/compat';
import {View, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

const Chat = ({route}) => {
  const {contactName, userId} = route.params;
  const [fullname, setFullName] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigation = useNavigation();

  const user1Id = 1; // Replace with the actual user ID for the current user

  // Fetch current user data from Firestore
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const userDoc = await firebase
          .firestore()
          .collection('users')
          .doc(user1Id.toString())
          .get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setCurrentUser(userData);
          setFullName(userData.fullname);
        }
      } catch (error) {
        console.error('Error fetching current user data:', error);
      }
    }

    // Call the fetchCurrentUser function when the component mounts
    fetchCurrentUser();
  }, []);

  // Function to determine the message style based on the sender
  const renderMessage = message => {
    if (message.user._id === user1Id) {
      // Message sent by the current user (display in blue on the right)
      return {
        ...message,
        user: {
          ...message.user,
          name: currentUser ? currentUser.fullname : '',
        },
        sent: true,
        received: true,
        position: 'right',
        containerStyle: {
          backgroundColor: '#007AFF',
        },
        textStyle: {
          color: '#fff',
        },
      };
    } else {
      // Message sent by the other person (display in white on the left)
      return {
        ...message,
        user: {
          ...message.user,
          name: contactName,
        },
        sent: true,
        received: true,
        position: 'left',
        containerStyle: {
          backgroundColor: '#fff',
        },
        textStyle: {
          color: '#000',
        },
      };
    }
  };

  // Function to handle sending a message
  const onSend = useCallback(
    async (newMessages = []) => {
      try {
        const messageData = newMessages[0];

        // Add the message to the "chats" collection and subcollection
        await firebase
          .firestore()
          .collection('chats')
          .doc(chatId)
          .collection('messages')
          .add({
            text: messageData.text,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            user: {
              _id: messageData.user._id,
              name: fullname,
            },
          });

        // Update the state with the new message
        setMessages(prevMessages =>
          GiftedChat.append(prevMessages, newMessages),
        );
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    [fullname],
  );

  const chatId = generateChatId(user1Id, userId);

  return (
    <View className="flex-1">
      <View className="p-4 bg-white shadow-md">
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            className="translate-y-1">
            <MaterialCommunityIcons
              name="arrow-left-thin"
              size={30}
              color={'#f57c00'}
            />
          </TouchableOpacity>
          <Text className="text-[18px] px-2 text-black translate-y-1">
            {contactName}
          </Text>
        </View>
      </View>
      <GiftedChat
        messages={messages.map(renderMessage)}
        onSend={onSend}
        user={{
          _id: user1Id,
          name: fullname,
        }}
        renderUsernameOnMessage={true}
        alwaysShowSend
        placeholder="Type your message..."
      />
    </View>
  );
};

function generateChatId(user1Id, user2Id) {
  const sortedIds = [user1Id, user2Id].sort(); // Sort user IDs to ensure consistency
  return sortedIds.join('_'); // Concatenate and hash the sorted user IDs
}

export default Chat;
