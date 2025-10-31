import React, { useState } from "react";
import {
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  StyleSheet
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebaseConfig";
import Loader from "../Loader/Loader";
import Toast from "react-native-toast-message";

interface UploadProps {
  imageUrl?: ImageSourcePropType | undefined;
  filePath: string;
  showImage?: boolean;
  message?:string;
  onPress?: () => void;
}

export default function Upload({ imageUrl, filePath, showImage, message, onPress }: UploadProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    setUploading(true);
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const filename = `${filePath}`;
    const storageRef = ref(storage, filename);

    try{
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    setDownloadUrl(url);
    setUploading(false);
    setTimeout(() => {
      Toast.show({
        type: "success",
        text1: message ? message : "Sucesso ao enviar arquivo!",
      });
      if (onPress) {
        onPress();
      }
      setLoading(false);
    }, 1000);
    }catch(error){
      setTimeout(() => {
      Toast.show({
        type: "error",
        text1: "Ocorreu um erro ao enviar  o arquivo.",
      });
      setLoading(false);
    }, 1000);
    }
    
  };

  if (loading) {
    return <Loader size={"small"}></Loader>;
  }

  return (
    <>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={imageUri && showImage ? { uri: imageUri } : imageUrl}
          style={styles.avatar}
        />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 100,
    width: 40,
    height: 40,
  },
  loader: {
    marginTop: 20,
    alignItems: "center",
  },
});
