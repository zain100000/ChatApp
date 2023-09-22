import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';

const Users = () => {
  const [users, setUsers] = useState([]);
  const currentUser = auth().currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch the list of users from Firebase Realtime Database
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await database().ref('users').once('value');
        const usersData = usersSnapshot.val();
        if (usersData) {
          // Convert the object of users into an array and filter out the current user
          const usersArray = Object.values(usersData).filter(
            user => user.uid !== currentUser.uid,
          );

          // Fetch and attach user images to the user objects
          for (const user of usersArray) {
            const imageRef = storage().ref(`users/${user.uid}`);
            try {
              const url = await imageRef.getDownloadURL();
              user.imageURL = url;
            } catch (error) {
              // Handle errors (e.g., user doesn't have an image)
              console.error('Error fetching user image:', error);
              // You can provide a default image URL here if needed
              user.imageURL = 'No Image';
            }
          }

          setUsers(usersArray);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [currentUser]);

  return (
    <SafeAreaView className="flex-1">
      <FlatList
        data={users}
        keyExtractor={item => item.uid}
        renderItem={({item}) => (
          <TouchableOpacity
            className="border-b-2 border-secondary"
            onPress={() => {
              navigation.navigate('Chat', {selectedUser: item});
            }}>
            <View className="flex-row items-center p-4">
              <Image
                source={{uri: item.imageURL || 'no image'}}
                className="w-12 h-12 rounded-full mr-4"
              />
              <Text className="text-lg text-secondary font-semibold">
                {item.fullname || 'No Name'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default Users;
