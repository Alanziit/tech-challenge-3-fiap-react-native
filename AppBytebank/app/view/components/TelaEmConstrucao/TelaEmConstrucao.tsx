import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface TelaEmConstrucaoProps {
  onVoltar: () => void;
}

export default function TelaEmConstrucao({ onVoltar }: TelaEmConstrucaoProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/emConstrucao.png")} 
        style={styles.image}
      />
      <Text style={styles.titulo}>Ops! 🚧</Text>
      <Text style={styles.texto}>
        Esta funcionalidade ainda está em desenvolvimento.{"\n"}
        Em breve estará disponível para você!
      </Text>

      <TouchableOpacity style={styles.botao} onPress={onVoltar}>
        <Text style={styles.botaoTexto}>⬅️ Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F6F2",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    marginBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007B7F",
  },
  texto: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  botao: {
    backgroundColor: "#007B7F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
