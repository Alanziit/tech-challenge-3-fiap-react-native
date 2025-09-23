import React, { useState } from "react";
import { Image, TouchableOpacity,ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebaseConfig";
import { StyleSheet} from "react-native";

export default function UploadImage() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      await uploadImage();
    }
  };

  const uploadImage = async () => {
    if (!imageUri) return;

    setUploading(true);
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const filename = `images/${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);

    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    setDownloadUrl(url);
    setUploading(false);
  };

  return (
      <TouchableOpacity onPress={pickImage}>
      {downloadUrl ? (
        <Image
          source={{ uri: downloadUrl }}
          style={styles.avatar}
        />
      ) : <Image
          source={imageUri ? {uri: imageUri} : require("../../assets/images/avatar.png") }
          style={styles.avatar}
        />}
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatar:{
    borderRadius: "100%",
    width: 40,
    height: 40,
  }
});
