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
  updateAccountById,
} from "@/financeiro/util.service";
import { useSelector } from "react-redux";
import { User } from "@/financeiro/interfaces/user.interface";
import { getMonthName, getformattedDate } from "../../shared/date-utils";
import Upload from "../Upload/Upload";
import Loader from "../Loader/Loader";
import { Documento } from "../../financeiro/interfaces/documento.interface";

interface Transacao {
  id: string;
  tipo: string;
  valor: number;
  data: string;
  codigoTransacao?: string;
}

export default function ExtratoCard() {
  const user = useSelector((state: { user: User }) => state.user);
  const filePath = `documents/${user.id}/${Date.now()}.jpg`;
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState({
    id: "",
    userName: "",
    saldo: 0,
    extrato: [],
    documento: undefined as Documento | undefined,
  });

  const handleExtract = async (codigoTransacao: any) => {
    const documento = {
      documento: filePath,
      dataDocumento: new Date(),
      codigo: codigoTransacao,
    };

    const account = {
      documento: documento,
    };
    const response = await updateAccountById(user.id, account);
    if (response) {
      console.log("Documento atualizado com sucesso:", response);
    } else {
      console.log("Erro ao atualizar documento");
    }
  };

  useEffect(() => {
    getAccountUserById(user.id).then((data) => {
      if (data) {
        setTimeout(() => {
          const transacoes: Transacao[] = data.extrato.map((item: any) => ({
            id: item.id,
            tipo: item.tipo,
            valor: item.valor,
            data: item.data,
            codigoTransacao: item.codigoTransacao,
          }));
          setAccount(data);
          setTransacoes(transacoes);
          setLoading(false);
        }, 1000);
      }
    });
  }, [user.id]);

  if (loading) {
    return <Loader message={"Carregando extrato..."} size={"large"}></Loader>;
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
                {item.codigoTransacao == account.documento?.codigo && (
                  <>
                    <View style={styles.documentContent}>
                      <Text style={styles.subTitle}>Documento:</Text>
                      <Text style={styles.data}>
                        {account.documento?.documento
                          ? account.documento?.documento.split("/").pop()
                          : "-"}
                      </Text>
                    </View>
                    
                    <View style={styles.documentContent}>
                          <Text style={styles.subTitle}>Enviado em: </Text>
                    <Text style={styles.data}>
                      {account.documento?.dataDocumento
                        ? getformattedDate(
                            new Date(account.documento?.dataDocumento)
                          )
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
  subTitle:{
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
});
