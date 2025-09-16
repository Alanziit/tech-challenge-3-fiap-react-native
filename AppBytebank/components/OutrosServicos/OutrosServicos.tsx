// OutrosServicos.tsx
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { User } from "@/financeiro/interfaces/user.interface";

export default function OutrosServicos() {

  const user = useSelector((state: { user: User }) => state.user);

  return (
    <ScrollView contentContainerStyle={styles.servicesContainer}>
      <Text style={styles.tituloServicos}>Confira os serviços disponíveis</Text>

      <View style={styles.cardServices}>
        <View style={styles.card}>
          <Image
            source={require("@/assets/icone_emprestimo.png")}
            style={styles.icon}
          />
          <Text style={styles.cardText}>Empréstimo</Text>
        </View>

        <TouchableOpacity style={styles.card}>
          <Image
            source={require("@/assets/icone_cartao.png")}
            style={styles.icon}
          />
          <Text style={styles.cardText}>Meus Cartões</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Image
            source={require("@/assets/icone_doacao.png")}
            style={styles.icon}
          />
          <Text style={styles.cardText}>Doações</Text>
        </View>

        <View style={styles.card}>
          <Image
            source={require("@/assets/icone_pix.png")}
            style={styles.icon}
          />
          <Text style={styles.cardText}>Pix</Text>
        </View>

        <View style={styles.card}>
          <Image
            source={require("@/assets/icone_seguros.png")}
            style={styles.icon}
          />
          <Text style={styles.cardText}>Seguros</Text>
        </View>

        <View style={styles.card}>
          <Image
            source={require("@/assets/icone_credito.png")}
            style={styles.icon}
          />
          <Text style={styles.cardText}>Crédito Celular</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  servicesContainer: {
    backgroundColor: "#F2F6F2",
    borderRadius: 8,
    padding: 16,
  },
  tituloServicos: {
    fontWeight: "700",
    fontSize: 22,
    marginBottom: 16,
    fontFamily: "Inter",
  },
  cardServices: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    width: "30%",
    height: 160,
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    padding: 8,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 8,
    resizeMode: "contain",
  },
  cardText: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});
