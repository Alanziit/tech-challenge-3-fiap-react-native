import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useAuth } from "@/infra/context/AuthContext";
import Toast from "react-native-toast-message";

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess: () => void; // nova prop
}

export default function LoginModal({
  visible,
  onClose,
  onLoginSuccess,
}: LoginModalProps) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth();

  const handleChangeFormData = (field: string, text: string) => {
    setFormData({
      ...formData,
      [field]: text,
    });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao realizadar o login.",
      });
    }
    const isLooged = await login(formData.email, formData.password);

    if (isLooged) {
      console.log("Login realizado com sucesso!");

      onLoginSuccess();
    } else {
      Toast.show({
        type: "error",
        text1: "Não foi possível realizar o login.",
      });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          <Image
            source={require("../../assets/images/icone_login.png")}
            style={{ width: 150, height: 120, marginBottom: 20 }}
            resizeMode="contain"
          />

          <Text style={styles.title}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            value={formData.email}
            onChangeText={(text) => handleChangeFormData("email", text)}
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            value={formData.password}
            onChangeText={(text) => handleChangeFormData("password", text)}
            secureTextEntry
          />

          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitText}>Acessar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  closeText: {
    fontSize: 24,
    color: "red",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: "#47A138",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  submitText: {
    color: "white",
    fontWeight: "bold",
  },
});
