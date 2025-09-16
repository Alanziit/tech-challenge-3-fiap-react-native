// components/ExtratoCard/ExtratoCard.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { getAccountUserById } from "@/financeiro/util.service";
import { useSelector } from "react-redux";
import { User } from "@/financeiro/interfaces/user.interface";
import { getMonthName, getformattedDate } from "../../shared/date-utils";

interface Transacao {
  id: string;
  tipo: string;
  valor: number;
  data: string;
}

export default function ExtratoCard() {
  const user = useSelector((state: { user: User }) => state.user);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState({
    id: "",
    userName: "",
    saldo: 0,
    extrato: [],
  });

  useEffect(() => {
    getAccountUserById(user.id).then((data) => {
      if (data) {
        setTimeout(() => {
          const transacoes: Transacao[] = data.extrato.map((item: any) => ({
            id: item.id,
            tipo: item.tipo,
            valor: item.valor,
            data: item.data,
          }));
          setTransacoes(transacoes);
          setLoading(false);
        }, 1000);
      }
    });
  }, [user.id]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Carregando extrato...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Extrato</Text>
      <FlatList
        data={transacoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          // Ajuste para garantir que SAQUE seja sempre negativo
          const isSaque = item.tipo === "Saque";
          const valorExibido = isSaque
            ? `- R$ ${Math.abs(item.valor)}`
            : item.valor >= 0
            ? `+ R$ ${item.valor}`
            : `- R$ ${Math.abs(item.valor)}`;

          const corValor = isSaque
            ? "#b52626"
            : item.valor >= 0
            ? "#47A138"
            : "#b52626";

          return (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.tipo}>{item.tipo}</Text>
                  <Text style={[styles.valor, { color: corValor }]}>
                    {valorExibido}
                  </Text>
                </View>
                <View>
                  <Text style={styles.data}>
                    {getMonthName(new Date(item.data))}
                  </Text>
                  <Text style={styles.data}>
                    {getformattedDate(new Date(item.data))}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    margin: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  card: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tipo: {
    fontSize: 16,
    fontWeight: "600",
  },
  valor: {
    fontSize: 16,
    fontWeight: "bold",
  },
  data: {
    fontSize: 14,
    color: "#666",
  },
  loader: {
    marginTop: 20,
    alignItems: "center",
  },
});
