import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import '../../../FirebaseConfig';
import firebase from 'firebase/compat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

// Function to generate a unique chat ID based on participant user IDs
function generateChatId(user1Id, user2Id) {
  const sortedIds = [user1Id, user2Id].sort(); // Sort user IDs to ensure consistency
  return sortedIds.join('_'); // Concatenate and hash the sorted user IDs
}

const Chat = ({route}) => {
  const {contactName, userId} = route.params;
  const [fullname, setFullName] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState(''); // State to store the selected user's name

  const navigation = useNavigation();

  const user1Id = 1; // Replace with the actual user ID for the current user

  // Generate the chat ID based on user IDs
  const chatId = generateChatId(user1Id, userId);

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
              name: fullname, // Replace with the actual user name
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

  // Fetch messages from Firestore when the component mounts
  useEffect(() => {
    // Subscribe to messages in the Firestore subcollection
    const unsubscribe = firebase
      .firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const messages = snapshot.docs
          .filter(doc => doc.exists) // Filter out documents that don't exist
          .map(doc => {
            const data = doc.data();
            const createdAt = data.createdAt ? data.createdAt.toDate() : null; // Check if createdAt exists
            return {
              _id: doc.id,
              text: data.text,
              createdAt,
              user: data.user,
            };
          });

        setMessages(messages);
      });

    return () => unsubscribe(); // Unsubscribe when the component unmounts
  }, []);

  // Fetch the sender's name from the "users" collection
  useEffect(() => {
    async function fetchSenderName() {
      try {
        const userDoc = await firebase
          .firestore()
          .collection('users')
          .doc(userId)
          .get();
        if (userDoc.exists) {
          const senderName = userDoc.data().fullname;
          // Update the selected user's name in state
          setSelectedUserName(senderName);
        }
      } catch (error) {
        console.error('Error fetching sender name:', error);
      }
    }

    // Call the fetchSenderName function when the component mounts and when the selected user changes
    fetchSenderName();
  }, [userId]);

  return (
    <View style={{flex: 1}}>
      <View
        style={{padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
        <View className="flex-row">
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <MaterialCommunityIcons
              name="arrow-left-thin"
              size={28}
              color="#f57c00"
            />
          </TouchableOpacity>
          <Text className="text-black font-bold text-[20px] translate-x-3">
            {contactName}
          </Text>
        </View>
      </View>
      <GiftedChat
        messages={messages}
        onSend={newMessages => onSend(newMessages)}
        user={{
          _id: user1Id, // Unique ID for the user (you can use any value)
          name: fullname, // Replace with the actual user name
        }}
        renderUsernameOnMessage={true} // Display sender's name in message bubbles
        alwaysShowSend
        placeholder="Type your message..."
      />
    </View>
  );
};

export default Chat;
