import { Account } from "@/financeiro/interfaces/account.interface";
import { createAccount, createUser, getUsers } from "@/financeiro/util.service";
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";

interface RegisterModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function RegisterModal({ visible, onClose }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    terms: false,
    id: "",
    dataCriacao: new Date(),
  });

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleAccount = async () => {
    const novaContaUsuario: Account = {
        userName: formData.userName,
        id: formData.id,
        dataCriacao: formData.dataCriacao,
        saldo: 0,
        extrato: [],
      };

      const response = await createAccount(novaContaUsuario);

      if(response.ok) {
        console.log("Conta criada com sucesso!");
      }
  };

  const handleSubmit = async (event:any) => {
    event.preventDefault();

    const responseUsers = await getUsers();

    if (responseUsers.ok) {
      const usuarios = await responseUsers.json();

      const idUsuario =
        usuarios.length > 0 ? parseInt(usuarios[usuarios.length - 1].id) + 1 : 1;
      formData.id = idUsuario.toString();
    }

    const response = await createUser(formData);

    if (response.ok) {
      handleAccount();
      alert("Usuário cadastrado com sucesso!");
      setFormData({} as any);
    } else {
      alert("Erro ao cadastrar usuário!");
      setFormData({} as any);
    }

    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          <Image
            source={require("../../assets/images/image_register.png")}
            style={{ width: 150, height: 120, marginBottom: 20 }}
            resizeMode="contain"
          />

          <Text style={styles.title}>
            Preencha os campos abaixo para criar sua conta!
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            value={formData.userName}
            onChangeText={(text) => handleChange("userName", text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry
          />

          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitText}>Criar conta</Text>
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
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
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
