// Cartoes.tsx
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";

export default function Cartoes() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.tituloSecao}>Meus cartões</Text>

      {/* Cartão físico */}
      <View style={styles.cartaoSection}>
        <Text style={styles.subtitulo}>Cartão físico</Text>
        <View style={styles.cartao}>
          <Image
            source={require("../../assets/images/cartao_fisico.png")}
            style={styles.imagemCartao}
          />
          <View style={styles.acoesCartao}>
            <TouchableOpacity style={styles.botaoConfigurar}>
              <Text style={styles.textoBotaoConfigurar}>Configurar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoBloquear}>
              <Text style={styles.textoBotaoBloquear}>Bloquear</Text>
            </TouchableOpacity>
            <Text style={styles.funcaoCartao}>Função: Débito/Crédito</Text>
          </View>
        </View>
      </View>

      {/* Cartão digital */}
      <View style={styles.cartaoSection}>
        <Text style={styles.subtitulo}>Cartão digital</Text>
        <View style={styles.cartao}>
          <Image
            source={require("../../assets/images/cartao_digital.png")}
            style={styles.imagemCartao}
          />
          <View style={styles.acoesCartao}>
            <TouchableOpacity style={styles.botaoConfigurar}>
              <Text style={styles.textoBotaoConfigurar}>Configurar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoBloquear}>
              <Text style={styles.textoBotaoBloquear}>Bloquear</Text>
            </TouchableOpacity>
            <Text style={styles.funcaoCartao}>Função: Débito</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F2F6F2",
    padding: 16,
  },
  tituloSecao: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 20,
    fontFamily: "Inter",
  },
  cartaoSection: {
    marginBottom: 20,
  },
  subtitulo: {
    marginLeft: 20,
    color: "#2f2e41",
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 18,
    marginBottom: 10,
  },
  cartao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 10,
    backgroundColor: "#FFFFFF",
    elevation: 2, // sombra no Android
    shadowColor: "#000", // sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  imagemCartao: {
    width: 160,
    height: 90,
    resizeMode: "contain",
    borderRadius: 8,
  },
  acoesCartao: {
    flex: 1,
    flexDirection: "column",
    gap: 10,
    marginLeft: 20,
  },
  botaoConfigurar: {
    backgroundColor: "#ff5722",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotaoConfigurar: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter",
  },
  botaoBloquear: {
    backgroundColor: "#cacacd4f",
    borderWidth: 2,
    borderColor: "#ff5722",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotaoBloquear: {
    color: "#ff5722",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter",
  },
  funcaoCartao: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#2f2e41",
    fontFamily: "Inter",
    fontWeight: "400",
  },
});
