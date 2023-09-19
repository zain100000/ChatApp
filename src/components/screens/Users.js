import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, TextInput} from 'react-native';
import Contacts from 'react-native-contacts';
import {PermissionsAndroid} from 'react-native';
import '../../../FirebaseConfig';
import {useNavigation} from '@react-navigation/native';

const Users = () => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);
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
        setContacts(allContacts);
      } else {
        console.log('Contacts permission denied.');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    // Fetch and display contacts when the component initializes
    requestContactsPermission();
  }, []);

  useEffect(() => {
    // Filter contacts based on the search query
    const filtered = contacts.filter(contact =>
      contact.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredContacts(filtered);
  }, [searchQuery, contacts]);

  return (
    <View className="flex-1">
      <TextInput
        placeholder="Search contacts..."
        onChangeText={text => setSearchQuery(text)}
        value={searchQuery}
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          margin: 10,
          padding: 5,
        }}
      />
      <FlatList
        data={filteredContacts} // Use filteredContacts instead of contacts
        keyExtractor={item => item.recordID}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Chat', {
                contactName: item.displayName,
              })
            }>
            <View>
              <Text className="text-black font-bold">{item.displayName}</Text>
              {/* Add more contact info here */}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Users;
