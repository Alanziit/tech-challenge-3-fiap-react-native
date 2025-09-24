import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface GraficoInvestimentoProps {
  saldo: number; // saldo inicial da conta
  onSaldoAtualizado: (novoSaldo: number) => void;
  valoresInvestimentos?: number[];
}

export default function GraficoInvestimento({
  saldo,
  onSaldoAtualizado,
  valoresInvestimentos = [],
}: GraficoInvestimentoProps) {
  const [valores, setValores] = useState<number[]>([]);
  const [valorInput, setValorInput] = useState("");
  const [valorNumeric, setValorNumeric] = useState<number>(0);
  const [totalInvestido, setTotalInvestido] = useState(0);
  const [saldoAtual, setSaldoAtual] = useState(saldo); // saldo interno para cálculos

  // sincroniza saldo inicial e valoresInvestimentos
  useEffect(() => {
    setSaldoAtual(saldo);
    if (valoresInvestimentos.length > 0) {
      setValores(valoresInvestimentos);
      setTotalInvestido(
        valoresInvestimentos.reduce((acc, val) => acc + val, 0)
      );
    }
  }, [saldo, valoresInvestimentos]);

  // Formata o valor em BRL
  const formatarValor = (valor: string) => {
    const numericValue = valor.replace(/\D/g, "");
    if (!numericValue) {
      setValorInput("");
      setValorNumeric(0);
      return;
    }
    const valorFinal = (parseFloat(numericValue) / 100).toFixed(2);
    setValorInput(
      Number(valorFinal).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    );
    setValorNumeric(parseFloat(valorFinal));
  };

  const aplicarInvestimento = () => {
    if (valorNumeric <= 0) return;

    if (valorNumeric > saldoAtual) {
      Alert.alert("Erro", "Saldo insuficiente para este investimento.");
      return;
    }

    const novoSaldo = saldoAtual - valorNumeric;
    const novoTotalInvestido = totalInvestido + valorNumeric;

    setSaldoAtual(novoSaldo);
    setTotalInvestido(novoTotalInvestido);
    onSaldoAtualizado(novoSaldo);

    setValores((prev) => [...prev, valorNumeric]); // adiciona valor positivo no gráfico
    setValorInput("");
    setValorNumeric(0);
  };

  const resgatarInvestimento = () => {
    if (valorNumeric <= 0) return;

    if (valorNumeric > totalInvestido) {
      Alert.alert("Erro", "Você não possui este valor investido.");
      return;
    }

    const novoSaldo = saldoAtual + valorNumeric;
    const novoTotalInvestido = totalInvestido - valorNumeric;

    setSaldoAtual(novoSaldo);
    setTotalInvestido(novoTotalInvestido);
    onSaldoAtualizado(novoSaldo);

    setValores((prev) => [...prev, -valorNumeric]); // registra resgate no gráfico
    setValorInput("");
    setValorNumeric(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meus Investimentos</Text>

      <Text style={styles.saldoInvestido}>
        Total Investido: R$ {totalInvestido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </Text>
      <Text style={styles.saldoInvestido}>
        Saldo Disponível: R$ {saldoAtual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </Text>

      <LineChart
        data={{
          labels: valores.map((_, i) => `#${i + 1}`),
          datasets: [{ data: valores.length > 0 ? valores : [0] }],
        }}
        width={Dimensions.get("window").width - 40}
        height={220}
        yAxisLabel="R$"
        chartConfig={{
          backgroundColor: "#007B7F",
          backgroundGradientFrom: "#007B7F",
          backgroundGradientTo: "#004D61",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
          labelColor: () => "#fff",
        }}
        bezier
        style={styles.grafico}
      />

      <TextInput
        style={styles.input}
        placeholder="R$ 0,00"
        keyboardType="numeric"
        value={valorInput}
        onChangeText={formatarValor}
      />

      <View style={styles.botoesContainer}>
        <TouchableOpacity style={[styles.botao, { backgroundColor: "#FF5031" }]} onPress={resgatarInvestimento}>
          <Text style={styles.textoBotao}>Resgatar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 },
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#004D61" },
  saldoInvestido: { fontSize: 16, fontWeight: "600", marginBottom: 10, color: "#004D61" },
  grafico: { marginVertical: 20, borderRadius: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#004D61",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    marginBottom: 15,
    backgroundColor: "white",
  },
  botoesContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  botao: {
    flex: 1,
    backgroundColor: "#007B7F",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  textoBotao: { color: "white", fontWeight: "bold", fontSize: 16 },
});
