// components/ExtratoCard/ExtratoCard.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  getUserById,
  updateAccountById,
} from "@/app/domain/usecases/util.service";
import { User } from "@/app/domain/entities/user.entity";
import { getMonthName, getformattedDate } from "../../../../shared/date-utils";
import Upload from "../Upload/Upload";
import Loader from "../Loader/Loader";
import { Documento } from "../../../domain/entities/documento.entity";
import { useAuth } from "@/app/infra/context/AuthContext";
import { Conta } from "@/app/domain/entities/conta.entity";

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
  const [account, setAccount] = useState({
    id: "",
    userName: "",
    conta: {} as Conta,
  });
  const [documento, setDocumento] = useState<Documento | undefined>(undefined);
  const [filtro, setFiltro] = useState<"Todos" | "Saque" | "Depósito">("Todos");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [transacoesTotais, setTransacoesTotais] = useState<Transacao[]>([]);

  const ITENS_POR_PAGINA = 20;

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

  const fetchTransacoes = useCallback(async () => {
    const profile = await getUserById(user.id);
    if (profile) {
      const lista = (profile.conta.extrato ?? []).map(
        (item: any, index: number) => ({
          id: item.id ?? index.toString(),
          tipo: item.tipo,
          valor: item.valor,
          data: item.data,
          codigoTransacao: item.codigoTransacao,
        })
      );

      // Ordena do mais recente para o mais antigo
      const ordenadas = lista.sort(
        (a: { data: string | number | Date; }, b: { data: string | number | Date; }) =>
          new Date(b.data).getTime() - new Date(a.data).getTime()
      );

      setTransacoesTotais(ordenadas);
      setTransacoes(ordenadas.slice(0, ITENS_POR_PAGINA));
      setAccount(profile);
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchTransacoes();
  }, [fetchTransacoes]);

  // Paginação dinâmica (scroll infinito)
  const carregarMais = () => {
    if (loadingMore || transacoes.length >= transacoesTotais.length) return;
    setLoadingMore(true);
    setTimeout(() => {
      const novaPagina = pagina + 1;
      const novoSlice = transacoesTotais.slice(
        0,
        novaPagina * ITENS_POR_PAGINA
      );
      setTransacoes(novoSlice);
      setPagina(novaPagina);
      setLoadingMore(false);
    }, 1000);
  };

  if (loading) {
    return <Loader message={"Carregando extrato..."} size={"large"} />;
  }

  // Aplica o filtro selecionado
  const transacoesFiltradas =
    filtro === "Todos"
      ? transacoes
      : transacoes.filter((t) => t.tipo === filtro);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Extrato</Text>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        {["Todos", "Saque", "Depósito"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              filtro === f && styles.filterButtonAtivo,
            ]}
            onPress={() => setFiltro(f as any)}
          >
            <Text style={styles.filterText}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Scroll vertical infinito */}
      <FlatList
        data={transacoesFiltradas}
        keyExtractor={(item) => item.codigoTransacao ?? item.id}
        showsVerticalScrollIndicator={false}
        onEndReached={carregarMais}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color="#007B7F"
              style={{ marginVertical: 10 }}
            />
          ) : null
        }
        renderItem={({ item }) => {
          const isSaque = item.tipo === "Saque";
          const valorExibido = isSaque
            ? `- R$ ${Math.abs(item.valor)}`
            : item.valor >= 0
            ? `+ R$ ${item.valor}`
            : `- R$ ${Math.abs(item.valor)}`;

          const corValor = isSaque ? "#b52626" : "#47A138";

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
                <TouchableOpacity style={styles.iconUpload}>
                  <Upload
                    imageUrl={require("../../assets/images/upload-icon.png")}
                    filePath={filePath}
                    message={"Documento enviado com sucesso!"}
                    onPress={() => handleExtract(item.codigoTransacao)}
                  />
                </TouchableOpacity>
              </View>

              {getCodigoTransacao(item.codigoTransacao) && (
                <View>
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
                        ? getformattedDate(
                            new Date(documento?.dataDocumento)
                          )
                        : "-"}
                    </Text>
                  </View>
                </View>
              )}
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
    flex: 10,
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
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 1,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
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
    backgroundColor: "#ccc",
  },
  filterButtonAtivo: {
    backgroundColor: "#007B7F",
  },
  filterText: {
    color: "#fff",
    fontWeight: "600",
  },
  iconUpload: {
    marginTop: 10,
  },
});
