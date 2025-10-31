import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, ActivityIndicator } from "react-native";
import { User } from "../../../domain/entities/user.entity";
import Icon from "react-native-vector-icons/FontAwesome";
import { useAuth } from "@/infra/context/AuthContext";
import { Conta } from "@/domain/entities/conta.entity";
import { UserController } from "@/presentation/controllers/UserController";
import { Provider } from "react-redux";
import ExtratoCard from "../ExtratoCard/ExtratoCard";
import store from "@/infra/redux/store";
import Upload from "@/components/Upload/Upload";
import TransactionBlock from "../TransacaoBloco/Transacaobloco";
import TelaEmConstrucao from "@/components/TelaEmConstrucao/TelaEmConstrucao";
import Cartoes from "@/components/Cartoes/Cartoes";
import GraficoInvestimento from "@/components/GraficoInvestimento/GraficoInvestimento";
import BotaoMenu from "@/components/BotaoMenu/botaoMenu";



interface UserHomeProps {
  onLogout: () => void;
}

export default function UserHome({ onLogout }: UserHomeProps) {
  const userController = new UserController();
  const user = useAuth().profile as User;
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const filePath = `images/${user.id}`;
  const [selectedScreen, setSelectedScreen] = useState<
    "home" | "extrato" | "services" | "cartoes" | "construcao" | "investimentos"
  >("home");

  const [account, setAccount] = useState({
    userName: "",
    conta: {} as Conta,
  });

  const [atualizandoSaldo, setAtualizandoSaldo] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [showServices, setShowServices] = useState(false);

  // novos estados para gráfico de investimento
  const [investimentos, setInvestimentos] = useState<number[]>([]);

  const toggleBalanceVisibility = () => setIsBalanceVisible(!isBalanceVisible);

  const atualizarConta = async () => {
    try {
      const profile = await userController.getUserById(user.id);
      console.log("Perfil atualizado:", profile);
      if (profile) {
        setAccount({
          userName: profile.userName,
          conta: profile.conta,
        });

        // se houver extrato/investimentos no backend, atualize também o array local de investimentos (se necessário)
        if (profile.conta?.extrato) {
          // aqui estamos apenas reconstruindo uma lista de "investimentos" a partir do extrato,
          // se no seu backend tiver um campo específico para investimentos, adapte.
          const list = (profile.conta.extrato || [])
            .filter((t: any) => t.tipo === "Investimento")
            .map((t: any) => t.valor);
          if (list.length > 0) setInvestimentos(list);
        }
      }
    } catch (err) {
      console.warn("Erro ao atualizar conta:", err);
    }
  };

  useEffect(() => {
    atualizarConta();
  }, [user.id]);

  // Recarrega sempre que volta para a tela home (garante dados atualizados)
  useEffect(() => {
    if (selectedScreen === "home") {
      atualizarConta();
    }
  }, [selectedScreen]);

  useEffect(() => {
    if (atualizandoSaldo) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, { toValue: 0.3, duration: 500, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();

      const timer = setTimeout(() => {
        setAtualizandoSaldo(false);
        atualizarConta();
        fadeAnim.setValue(1);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [atualizandoSaldo]);

  useEffect(() => {
    if (selectedScreen === "services") {
      setShowServices(false);
      const timer = setTimeout(() => {
        setShowServices(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowServices(false);
    }
  }, [selectedScreen]);

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

  // função para adicionar investimento ao gráfico (vinda do TransactionBlock)
  const adicionarInvestimento = (valor: number) => {
    setInvestimentos((prev) => [...prev, valor]);
  };

  // novo handler: atualiza o saldo dentro de account.conta.saldo e persiste no backend
  const handleSaldoAtualizado = async (novoSaldo: number) => {
    // Atualiza localmente o estado de account (conta.saldo)
    setAccount((prev) => {
      const updated = {
        ...prev,
        conta: { ...prev.conta, saldo: novoSaldo },
      };
      // Persistir no backend (chamada assíncrona, não bloqueante)
      userController.updateAccountById(user.id, {
        userName: updated.userName || user.userName,
        conta: updated.conta,
      }).catch((err) => console.warn("Erro ao persistir saldo:", err));
      return updated;
    });
  };

  // handler para sincronizar a lista de pontos do gráfico com o estado do pai
  const handleInvestimentosChange = (novosValores: number[]) => {
    setInvestimentos(novosValores);
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#E4EDE3" }}>
        {selectedScreen === "extrato" && (
            <Provider store={store}>
              <ExtratoCard />
            </Provider>
          )}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {selectedScreen === "home" && (
            <>
              <View style={styles.header}>
                <Upload imageUrl={require("../../../assets/images/avatar.png")} filePath={filePath}></Upload>
              </View>
              <View style={styles.balanceCard}>
                <Text style={styles.greeting}>Olá, {user.userName}! :)</Text>
                <Text style={styles.date}>{getCurrentDate()}</Text>

                <View style={styles.balanceInfo}>
                  <Text style={styles.balanceLabel}>Saldo</Text>
                  <TouchableOpacity onPress={toggleBalanceVisibility}>
                      <Icon style={styles.eyeIcon} name={isBalanceVisible ? "eye" : "eye-slash"} size={20} color="#000" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.contaCorrente}>Conta Corrente</Text>
                <Animated.Text style={[styles.valorSaldo, { opacity: fadeAnim }]}>
                  {isBalanceVisible
                    ? `R$ ${(account.conta?.saldo ?? 0).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "●●●,●●"}
                </Animated.Text>
              </View>

              <TransactionBlock
                onTransacaoSucesso={() => setAtualizandoSaldo(true)}
                onInvestimento={adicionarInvestimento} // envia valor para gráfico
              />

            </>
          )}

          {selectedScreen === "services" && (
            <View style={styles.servicesContainer}>
              {showServices ? (
                <>
                  <Text style={styles.servicesTitle}>Serviços Disponíveis</Text>
                  <TouchableOpacity
                    style={styles.serviceButton}
                    onPress={() => setSelectedScreen("construcao")}
                  >
                    <Text style={styles.serviceButtonText}>💰 Empréstimo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.serviceButton}
                    onPress={() => setSelectedScreen("cartoes")}
                  >
                    <Text style={styles.serviceButtonText}>💳 Meus Cartões</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.serviceButton}
                    onPress={() => setSelectedScreen("construcao")}
                  >
                    <Text style={styles.serviceButtonText}>🙏 Doações</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.serviceButton}
                    onPress={() => setSelectedScreen("construcao")}
                  >
                    <Text style={styles.serviceButtonText}>⚡ Pix</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.serviceButton}
                    onPress={() => setSelectedScreen("construcao")}
                  >
                    <Text style={styles.serviceButtonText}>🛡️ Seguros</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.serviceButton}
                    onPress={() => setSelectedScreen("construcao")}
                  >
                    <Text style={styles.serviceButtonText}>📱 Crédito Celular</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.loader}>
                  <ActivityIndicator size="large" color="#4CAF50" />
                  <Text>Carregando serviços...</Text>
                </View>
              )}
            </View>
          )}

          {selectedScreen === "cartoes" && <Cartoes />}

          {selectedScreen === "construcao" && (
            <TelaEmConstrucao onVoltar={() => setSelectedScreen("services")} />
          )}

          {selectedScreen === "investimentos" && (
            <GraficoInvestimento
              saldo={account.conta?.saldo ?? 0}
              onSaldoAtualizado={handleSaldoAtualizado}
              valoresInvestimentos={investimentos}
              onInvestimentosChange={handleInvestimentosChange}
            />
          )}
        </ScrollView>

        <BotaoMenu onLogout={onLogout} onNavigate={setSelectedScreen} />
      </View>
      
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    width: "100%",
    height: 50,
    backgroundColor: "#007B7F",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
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
  servicesContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.00)",
    borderRadius: 8,
    elevation: 2,
  },
  servicesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#007B7F",
  },
  serviceButton: {
    padding: 15,
    backgroundColor: "#007B7F",
    borderRadius: 6,
    marginBottom: 10,
  },
  serviceButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    marginTop: 50,
    alignItems: "center",
  },
});
