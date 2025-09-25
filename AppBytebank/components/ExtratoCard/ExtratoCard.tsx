// components/ExtratoCard/ExtratoCard.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  getAccountUserById,
  getUserById,
  updateAccountById,
} from "@/financeiro/util.service";
import { useSelector } from "react-redux";
import { User } from "@/financeiro/interfaces/user.interface";
import { getMonthName, getformattedDate } from "../../shared/date-utils";
import Upload from "../Upload/Upload";
import Loader from "../Loader/Loader";
import { Documento } from "../../financeiro/interfaces/documento.interface";
import { useAuth } from "@/context/AuthContext";
import { get } from "firebase/database";
import { Conta } from "@/financeiro/interfaces/conta.interface";

interface Transacao {
  id: string;
  tipo: string;
  valor: number;
  data: string;
  codigoTransacao?: string;
}

export default function ExtratoCard() {
  const user = useAuth().profile as User;
  const filePath = `documents/${user.id}/${Date.now()}.jpg`;
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState({
    id: "",
    userName: "",
    conta: {} as Conta,
  });
  const [documento, setDocumento] = useState<Documento | undefined>(undefined);

  // --- ESTADO DO FILTRO ---
  const [filtro, setFiltro] = useState<"Todos" | "Saque" | "Depósito">("Todos");

  const handleExtract = async (codigoTransacao: any) => {
    const documento = {
      documento: filePath,
      dataDocumento: new Date(),
      codigo: codigoTransacao,
    };

    account.conta.documento
      ? account.conta.documento?.push(documento)
      : (account.conta.documento = [documento]);

    const response = await updateAccountById(user.id, account);
    if (response) {
      console.log("Documento atualizado com sucesso:", response);
    } else {
      console.log("Erro ao atualizar documento");
    }
  };

  const getCodigoTransacao = (codigo: any): boolean => {
    if (account) {
      const resp = account.conta.documento?.find((d) => d.codigo === codigo);
      if (resp) {
        setDocumento(resp);
        return true;
      }
      return false;
    }
    return false;
  };

  useEffect(() => {
    const fetchData = async () => {
      const profile = await getUserById(user.id);

      if (profile) {
        console.log(profile);
        setTimeout(() => {
          const transacoes: Transacao[] = (profile.conta.extrato ?? []).map(
            (item: any) => ({
              id: item.id,
              tipo: item.tipo,
              valor: item.valor,
              data: item.data,
              codigoTransacao: item.codigoTransacao,
            })
          );
          console.log(transacoes);
          setAccount(user.conta);
          setTransacoes(transacoes);
          setLoading(false);
        }, 2000);
      }
    };
    fetchData();
  }, [user.id, user.conta]);

  if (loading) {
    return <Loader message={"Carregando extrato..."} size={"large"}></Loader>;
  }

  // --- FILTRO DAS TRANSAÇÕES ---
  const transacoesFiltradas =
    filtro === "Todos"
      ? transacoes
      : transacoes.filter((t) => t.tipo === filtro);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Extrato</Text>

      {/* Botões de Filtro */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filtro === "Todos" && styles.filterButtonAtivo,
          ]}
          onPress={() => setFiltro("Todos")}
        >
          <Text style={styles.filterText}>Todos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filtro === "Saque" && styles.filterButtonAtivo,
          ]}
          onPress={() => setFiltro("Saque")}
        >
          <Text style={styles.filterText}>Saques</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filtro === "Depósito" && styles.filterButtonAtivo,
          ]}
          onPress={() => setFiltro("Depósito")}
        >
          <Text style={styles.filterText}>Depósitos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={transacoesFiltradas}
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
                <TouchableOpacity>
                  <Upload
                    imageUrl={require("../../assets/images/upload-icon.svg")}
                    filePath={filePath}
                    message={"Documento enviado com sucesso!"}
                    onPress={() => handleExtract(item.codigoTransacao)}
                  ></Upload>
                </TouchableOpacity>
              </View>
              <View>
                {getCodigoTransacao(item.codigoTransacao) && (
                  <>
                    <View style={styles.documentContent}>
                      <Text style={styles.subTitle}>Documento:</Text>
                      <Text style={styles.data}>
                        {documento?.documento
                          ? documento?.documento.split("/").pop()
                          : "-"}
                      </Text>
                    </View>

                    <View style={styles.documentContent}>
                      <Text style={styles.subTitle}>Enviado em: </Text>
                      <Text style={styles.data}>
                        {documento?.dataDocumento
                          ? getformattedDate(new Date(documento?.dataDocumento))
                          : "-"}
                      </Text>
                    </View>
                  </>
                )}
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
  subTitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#007B7F",
  },
  card: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    gap: 25,
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
  documentContent: {
    flexDirection: "row",
    gap: 5,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#ddd",
  },
  filterButtonAtivo: {
    backgroundColor: "#007B7F",
  },
  filterText: {
    color: "#fff",
    fontWeight: "600",
  },
});
