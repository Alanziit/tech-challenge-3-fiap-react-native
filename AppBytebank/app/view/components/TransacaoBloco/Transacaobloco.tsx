import React, { useEffect, useState } from "react";
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
import { useDispatch } from "react-redux";

import { User } from "@/app/domain/entities/user.entity";
import { updateAccountById, getUserById } from "@/app/domain/usecases/util.service";
import { ReauthenticateUser, useAuth } from "@/app/infra/context/AuthContext";
import { Conta } from "@/app/domain/entities/conta.entity";

import { setUser } from "@/app/infra/redux/userSlice";
import { CacheService } from "@/app/infra/cache/cache.service"; // 🔹 AJUSTE: importado para atualizar cache local

interface TransactionBlockProps {
  onTransacaoSucesso?: () => void;
  onInvestimento?: (valor: number) => void;
}

export default function TransactionBlock({
  onTransacaoSucesso,
  onInvestimento,
}: TransactionBlockProps) {
  const { profile: user } = useAuth();
  const dispatch = useDispatch();
  const [transactionType, setTransactionType] = useState("");
  const [valorTransacao, setValorTransacao] = useState("");
  const [valorFormatado, setValorFormatado] = useState("");
  const [senhaDigitada, setSenhaDigitada] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mensagemModal, setMensagemModal] = useState(
    "Para concluir a transação, insira a senha cadastrada no login."
  );
  const [transacaoFinalizada, setTransacaoFinalizada] = useState(false);
  const [account, setAccount] = useState<Conta>({
    saldo: 0,
    extrato: [],
  } as unknown as Conta);

  // 🔹 Carrega conta real do usuário
  useEffect(() => {
    const carregarConta = async () => {
      if (!user) return;
      try {
        const profile = await getUserById(user.id);
        if (profile?.conta) setAccount(profile.conta);
      } catch (err) {
        console.warn("Erro ao carregar conta:", err);
      }
    };
    carregarConta();
  }, [user]);

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

  const confirmarTransacao = async () => {
    if (!user) {
      setMensagemModal("Usuário não autenticado.");
      return;
    }

    if (!account) {
      setMensagemModal("Conta do usuário não carregada ainda.");
      return;
    }

    const autenticado = await ReauthenticateUser(user.email ?? "", senhaDigitada);
    if (!autenticado) {
      setMensagemModal("Senha incorreta. Tente novamente.");
      return;
    }

    const valor = parseFloat(valorTransacao);
    const saldoAtual = account?.saldo ?? 0;

    if (
      (transactionType === "Saque" || transactionType === "Investimento") &&
      valor > saldoAtual
    ) {
      Alert.alert("Erro", "Saldo insuficiente.");
      return;
    }

    const novaTransacao = {
      tipo: transactionType,
      valor,
      data: new Date().toISOString(),
      codigoTransacao: Math.floor(Math.random() * 100000),
    };

    let novoSaldo = saldoAtual;
    if (transactionType === "Depósito") novoSaldo += valor;
    if (transactionType === "Saque") novoSaldo -= valor;
    if (transactionType === "Investimento") novoSaldo -= valor;

    const novoExtrato = [...(account.extrato || []), novaTransacao];

    const novaConta: Conta = {
      ...account,
      saldo: novoSaldo,
      extrato: novoExtrato,
    };

    try {
      const response = await updateAccountById(user.id, novaConta);

      if (response) {
        // 🔹 AJUSTE: Atualiza extrato e saldo dinamicamente sem alterar estrutura existente
        const perfilAtualizado = {
          ...user,
          conta: novaConta,
        };

        // Atualiza o estado global imediatamente
        dispatch(setUser(perfilAtualizado));

        // Atualiza cache local 'user_<id>' para manter consistência
        await CacheService.set(`user_${user.id}`, perfilAtualizado);

        setMensagemModal("Transação concluída com sucesso!");
        setTransacaoFinalizada(true);
        setAccount(novaConta);

        // Mantém lógica existente
        if (transactionType === "Investimento" && onInvestimento) {
          onInvestimento(valor);
        }

        if (onTransacaoSucesso) onTransacaoSucesso();

        // Fecha o modal automaticamente após alguns segundos
        setTimeout(() => setShowModal(false), 2000);
      } else {
        setMensagemModal("Erro ao processar a transação.");
      }
    } catch (err) {
      console.error("[API] updateAccountById erro:", err);
      setMensagemModal("Erro ao processar a transação.");
    }
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
        <Picker.Item label="Depósito" value="Depósito" />
        <Picker.Item label="Saque" value="Saque" />
        <Picker.Item label="Aplicar Investimento" value="Investimento" />
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
