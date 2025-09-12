import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { User } from "@/financeiro/interfaces/user.interface";

interface TransactionBlockProps {
  user: User;
}

export default function TransactionBlock({ user }: TransactionBlockProps) {
  const [transactionType, setTransactionType] = useState("");
  const [valorTransacao, setValorTransacao] = useState(""); // valor numérico
  const [valorFormatado, setValorFormatado] = useState(""); // exibição formatada
  const [senhaDigitada, setSenhaDigitada] = useState("");
  const [senhaCorreta] = useState(user.password ?? "123456"); // aqui você pode ajustar a origem da senha
  const [showModal, setShowModal] = useState(false);
  const [mensagemModal, setMensagemModal] = useState(
    "Para concluir a transação, insira a senha cadastrada no login."
  );
  const [transacaoFinalizada, setTransacaoFinalizada] = useState(false);

  const formatarValor = (valor: string) => {
    const numericValue = valor.replace(/\D/g, "");
    if (!numericValue) {
      setValorTransacao("");
      setValorFormatado("");
      return;
    }
    const valorFinal = (parseFloat(numericValue) / 100).toFixed(2);
    setValorTransacao(valorFinal);
    setValorFormatado(
      Number(valorFinal).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    );
  };

  const handleTransaction = () => {
    if (!transactionType || !valorTransacao) {
      Alert.alert("Erro", "Selecione o tipo de transação e insira um valor válido.");
      return;
    }
    setShowModal(true);
    setMensagemModal("Para concluir a transação, insira a senha cadastrada no login.");
    setTransacaoFinalizada(false);
    setSenhaDigitada("");
  };

  const confirmarTransacao = () => {
    if (senhaDigitada !== senhaCorreta) {
      setMensagemModal("Senha incorreta. Tente novamente.");
      return;
    }

    const valor = parseFloat(valorTransacao);

    if (transactionType === "Saque" && user.saldo < valor) {
      Alert.alert("Erro", "Saldo insuficiente.");
      return;
    }

    setMensagemModal("Transação concluída com sucesso!");
    setTransacaoFinalizada(true);

    setTimeout(() => {
      setShowModal(false);
    }, 2000);
  };

  return (
    <View style={styles.blocoTransacao}>
      <Text style={styles.titulo}>Nova Transação</Text>

    <Picker
        selectedValue={transactionType}
        onValueChange={(itemValue: string) => setTransactionType(itemValue)}
        style={styles.picker}
    >
        <Picker.Item label="Selecione o tipo de transação" value="" />
        <Picker.Item label="Saque" value="Saque" />
        <Picker.Item label="DOC/TED" value="Depósito" />
    </Picker>

      <TextInput
        style={styles.input}
        placeholder="R$ 0,00"
        value={valorFormatado}
        keyboardType="numeric"
        onChangeText={(text) => formatarValor(text)}
      />

      <TouchableOpacity style={styles.botaoTransacao} onPress={handleTransaction}>
        <Text style={styles.textoBotao}>Concluir transação</Text>
      </TouchableOpacity>

      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.mensagem}>{mensagemModal}</Text>

            {!transacaoFinalizada && (
              <>
                <TextInput
                  style={styles.inputSenha}
                  placeholder="Digite sua senha"
                  secureTextEntry
                  value={senhaDigitada}
                  onChangeText={setSenhaDigitada}
                />
                <View style={styles.botoesModal}>
                  <TouchableOpacity
                    style={styles.botaoConfirmar}
                    onPress={confirmarTransacao}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      Confirmar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.botaoFechar}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      Fechar
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  blocoTransacao: {
    backgroundColor: "#CBCBCB",
    padding: 20,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: "#004D61",
  },
  picker: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#004D61",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  botaoTransacao: {
    backgroundColor: "#007B7F",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotao: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: 300,
    alignItems: "center",
  },
  mensagem: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: "center",
  },
  inputSenha: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    marginBottom: 15,
  },
  botoesModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  botaoConfirmar: {
    flex: 1,
    marginRight: 5,
    padding: 12,
    backgroundColor: "#2ecc71",
    borderRadius: 8,
    alignItems: "center",
  },
  botaoFechar: {
    flex: 1,
    marginLeft: 5,
    padding: 12,
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    alignItems: "center",
  },
});
