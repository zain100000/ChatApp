import React, {useEffect, useState, useMemo} from 'react';
import {View, Text, FlatList, TouchableOpacity, TextInput} from 'react-native';
import Contacts from 'react-native-contacts';
import {PermissionsAndroid} from 'react-native';
import '../../../FirebaseConfig';
import {useNavigation} from '@react-navigation/native';

const Users = () => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  // Function to request contacts permission and fetch contacts
  const requestContactsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Fetch all contacts
        const allContacts = await Contacts.getAll();
        // Slice the array to get only the first 10 contacts (you can adjust the limit as needed)
        const limitedContacts = allContacts.slice(0, 10); // Change the limit here
        setContacts(limitedContacts);
      } else {
        console.log('Contacts permission denied.');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    // Fetch and display limited contacts when the component initializes
    requestContactsPermission();
  }, []);

  // Memoize the filtered contacts to improve performance
  const filteredContacts = useMemo(() => {
    return contacts
      .filter(
        contact =>
          contact.displayName &&
          contact.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [searchQuery, contacts]);

  return (
    <View className="flex-1">
      <TextInput
        placeholder="Search contacts..."
        placeholderTextColor={'black'}
        onChangeText={text => setSearchQuery(text)}
        value={searchQuery}
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          margin: 10,
          padding: 5,
          color: '#000',
        }}
      />
      <FlatList
        data={filteredContacts}
        keyExtractor={item => item.recordID.toString()} // Ensure a unique key
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Chat', {
                contactName: item.displayName,
              })
            }>
            <View className="flex-1 p-4">
              <Text className="text-black font-bold text-md">
                {item.displayName}
              </Text>
              {/* Add more contact info here */}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Users;
