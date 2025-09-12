import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { User } from "@/financeiro/interfaces/user.interface";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import BottomMenu from "../BotaoMenu/botaoMenu";
import TransactionBlock from "../TransacaoBloco/Transacaobloco";
import ExtratoCard from "../ExtratoCard/ExtratoCard";

interface UserHomeProps {
  user: User;
  onLogout: () => void;
}

export default function UserHome({ user, onLogout }: UserHomeProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<"home" | "extrato">("home");

  const toggleBalanceVisibility = () => setIsBalanceVisible(!isBalanceVisible);

  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return now.toLocaleDateString("pt-BR", options);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {selectedScreen === "home" ? (
          <>
            <View style={styles.balanceCard}>
              <Text style={styles.greeting}>Olá, {user.userName}! :)</Text>
              <Text style={styles.date}>{getCurrentDate()}</Text>

              <View style={styles.balanceInfo}>
                <Text style={styles.balanceLabel}>Saldo</Text>
                <TouchableOpacity onPress={toggleBalanceVisibility}>
                  <Text style={styles.eyeIcon}>
                    {isBalanceVisible ? <FaEye /> : <FaEyeSlash />}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.contaCorrente}>Conta Corrente</Text>
              <Text style={styles.valorSaldo}>
                {isBalanceVisible
                  ? `R$ ${
                      user.saldo?.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "0,00"
                    }`
                  : "●●●,●●"}
              </Text>
            </View>

            {/* Bloco de transações */}
            <TransactionBlock user={user} />
          </>
        ) : (
          <ExtratoCard />
        )}
      </ScrollView>

      {/* Menu no rodapé */}
      <BottomMenu onLogout={onLogout} onNavigate={setSelectedScreen} />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  balanceCard: {
    backgroundColor: "#007B7F",
    borderRadius: 8,
    padding: 20,
    margin: 20,
    justifyContent: "center",
    height: 300,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  date: {
    color: "white",
    marginVertical: 5,
  },
  balanceInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#FF5031",
    paddingBottom: 10,
    marginTop: 20,
  },
  balanceLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  eyeIcon: {
    fontSize: 20,
    color: "#FF5031",
  },
  contaCorrente: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "400",
    color: "white",
  },
  valorSaldo: {
    marginTop: 5,
    fontSize: 28,
    fontWeight: "400",
    color: "white",
  },
});
