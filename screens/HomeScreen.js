import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {app} from '../database/firebase'
import * as ImagePicker from 'expo-image-picker';

const auth = getAuth(app);

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userData) => {
      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      console.error('Permission to access media library was denied');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.uri);
      // You can add logic here to send the image to the backend for processing.
    }
  };

  return (
    <SafeAreaView>
      <View className='mt-6'>
        {user ? (
          <Text>Hello {user.displayName}</Text>
        ) : (
          <Text>No user signed in</Text>
        )}
      </View>
      <View>
        <TouchableOpacity onPress={selectImage}>
          <Text>Select an Image</Text>
        </TouchableOpacity>
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />
        )}
        {/* You can display the processed image here once it's received from the backend. */}
      </View>
    </SafeAreaView>
  );
}
