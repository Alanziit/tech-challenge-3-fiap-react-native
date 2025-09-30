import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BottomMenuProps {
  onNavigate: (
    screen: "home" | "extrato" | "services" | "cartoes" | "construcao" | "investimentos"
  ) => void;
  onLogout: () => void;
}

export default function BotaoMenu({ onNavigate, onLogout }: BottomMenuProps) {
  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate("home")}>
        <Ionicons name="home-outline" size={24} color="white" />
        <Text style={styles.menuText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate("extrato")}>
        <Ionicons name="document-text-outline" size={24} color="white" />
        <Text style={styles.menuText}>Extrato</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate("services")}>
        <Ionicons name="apps-outline" size={24} color="white" />
        <Text style={styles.menuText}>Serviços</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate("investimentos")}>
        <Ionicons name="trending-up-outline" size={24} color="white" />
        <Text style={styles.menuText}>Investimentos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={24} color="white" />
        <Text style={styles.menuText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#004D61",
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  menuItem: { alignItems: "center" },
  menuText: { color: "white", fontSize: 12, marginTop: 2 },
});
