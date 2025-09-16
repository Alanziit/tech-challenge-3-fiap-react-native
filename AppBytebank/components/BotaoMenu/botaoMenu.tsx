import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BottomMenuProps {
  onLogout: () => void;
  onNavigate: (screen: "home" | "extrato"| "services") => void;
}

export default function BottomMenu({ onLogout, onNavigate }: BottomMenuProps) {
  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate("home")}>
        <Ionicons name="home-outline" size={24} color="white" />
        <Text style={styles.menuText}>Início</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate("extrato")}>
        <Ionicons name="document-text-outline" size={24} color="white" />
        <Text style={styles.menuText}>Extrato</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          onNavigate("services");
        }}
          >
      <Ionicons name="card-outline" size={24} color="white" />
      <Text style={styles.menuText}>Outros serviços</Text>
    </TouchableOpacity>


      <TouchableOpacity style={styles.menuItem}>
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
    alignItems: "center",
    backgroundColor: "#007B7F",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#FF5031",
  },
  menuItem: {
    alignItems: "center",
  },
  menuText: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
});
