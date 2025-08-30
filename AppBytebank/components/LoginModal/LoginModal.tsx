import { User } from "@/financeiro/interfaces/user.interface";
import { getUsers } from "@/financeiro/util.service";
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
// se quiser Redux, pode importar aqui:
// import { useDispatch } from "react-redux";
// import { updateUser } from "../../redux/userSlice";

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function LoginModal({ visible, onClose }: LoginModalProps) {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChangeFormData = (field: string, text: string) => {
    setFormData({
      ...formData,
      [field]: text,
    });
  };

  const handleSubmit = async (event:any) => {
    event.preventDefault();

    const response = await getUsers();

    if (response.ok) {
      const usuarios = await response.json();

      const usuario = usuarios.filter(
        (usuario: User) =>
          usuario.email == formData.email &&
          usuario.password == formData.password
      );

      if (usuario.length > 0) {
        alert("Login realizado com sucesso!");
        onClose();

        //TODO TRAZER O REDUX AQUI
        //dispatch(updateUser({ name: usuario[0].userName, email: usuario[0].email, id: usuario[0].id }));
        console.log(usuario[0]);

        //UTILIZAR O NAVIGATION AO INVÉS DE REDIRECT
        //redirect(`/financeiro/pageUser/id=${usuario[0].id}`);
      } else {
        alert("Erro verifique usuário e senha");
      }
    } else {
      alert("Erro ao conectar com servidor");
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
function redirect(arg0: string) {
  throw new Error("Function not implemented.");
}

