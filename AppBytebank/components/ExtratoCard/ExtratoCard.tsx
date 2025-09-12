// components/ExtratoCard/ExtratoCard.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";

interface Transacao {
  id: string;
  tipo: string;
  valor: number;
  data: string;
}

export default function ExtratoCard() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulação de carregamento de dados (sem redux)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Exemplo mockado, troque pelo fetch no json-server ou API
        const data: Transacao[] = [
          { id: "1", tipo: "Depósito", valor: 500, data: "2025-09-10" },
          { id: "2", tipo: "Saque", valor: -200, data: "2025-09-11" },
        ];
        setTimeout(() => {
          setTransacoes(data);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.log("Erro ao carregar extrato:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.tipo}>{item.tipo}</Text>
            <Text
              style={[
                styles.valor,
                { color: item.valor >= 0 ? "green" : "red" },
              ]}
            >
              {item.valor >= 0 ? `+ R$ ${item.valor}` : `- R$ ${Math.abs(item.valor)}`}
            </Text>
            <Text style={styles.data}>{item.data}</Text>
          </View>
        )}
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
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
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
