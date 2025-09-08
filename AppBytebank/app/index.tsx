import LoginModal from "@/components/LoginModal/LoginModal";
import RegisterModal from "@/components/RegisterModal/RegisterModal";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { User } from "@/financeiro/interfaces/user.interface";
import UserHome from "@/components/UserHome/UserHome";
import Loading from "@/components/Loading/Loading";

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get("window").width);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  // Função chamada pelo LoginModal quando o login for bem-sucedido
  const handleLoginSuccess = (user: User) => {
    setLoading(true); 
    setIsModalOpen(false);

    setTimeout(() => {
    setLoggedUser(user);
    setLoading(false);
  }, 1500); 
};

  if (isLoading) {
    return <Loading />;
  }

  // Tela principal quando o usuário está logado
  if (loggedUser) {
    return (
      <UserHome
        user={loggedUser}
        onLogout={() => setLoggedUser(null)}
      />
      
    );
  }

  // Tela padrão (home) quando não há usuário logado
  return (
    
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Text style={styles.menuButton}>≡</Text>
        </TouchableOpacity>

        <Image
          source={require("../assets/images/icone_logo.png")}
          style={{ width: 150, height: 40 }}
          resizeMode="contain"
        />

        {windowWidth > 768 && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsModalRegisterOpen(true)}
            >
              <Text style={styles.buttonText}>Abrir minha conta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondary]}
              onPress={() => setIsModalOpen(true)}
            >
              <Text style={styles.buttonText}>Já tenho conta</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {menuOpen && (
        <View style={styles.dropdown}>
          <Text style={styles.navLink}>Sobre</Text>
          <Text style={styles.navLink}>Serviços</Text>
        </View>
      )}

      {/* Main */}
      <ScrollView contentContainerStyle={styles.main}>
        <View style={styles.blocoCentral}>
          <Text style={styles.titulo}>
            Experimente mais liberdade no controle da sua vida financeira.
            {"\n"}Crie sua conta com a gente!
          </Text>
          <Image
            source={require("../assets/images/icone_ilustracao_banner.png")}
            style={{ width: 300, height: 200 }}
            resizeMode="contain"
          />
        </View>

        {windowWidth <= 768 && (
          <>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setIsModalRegisterOpen(true)}
              >
                <Text style={styles.buttonText}>Abrir minha conta</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondary]}
                onPress={() => setIsModalOpen(true)}
              >
                <Text style={styles.buttonText}>Já tenho conta</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.vantagemBanco}>Vantagens do nosso banco:</Text>
          </>
        )}

        {/* Advantages */}
        <View style={styles.advantages}>
          <View style={styles.advantage}>
            <Image
              source={require("../assets/images/icone_presente.png")}
              style={{ width: 50, height: 50 }}
            />
            <Text style={styles.advantageTitle}>Conta e cartão gratuitos</Text>
            <Text style={styles.advantageText}>
              Nossa conta é digital, sem custo fixo e sem tarifa de manutenção.
            </Text>
          </View>
          <View style={styles.advantage}>
            <Image
              source={require("../assets/images/icone_saque.png")}
              style={{ width: 50, height: 50 }}
            />
            <Text style={styles.advantageTitle}>Saques sem custo</Text>
            <Text style={styles.advantageText}>
              Você pode sacar gratuitamente 4x por mês de qualquer Banco 24h.
            </Text>
          </View>
          <View style={styles.advantage}>
            <Image
              source={require("../assets/images/icone_estrela.png")}
              style={{ width: 50, height: 50 }}
            />
            <Text style={styles.advantageTitle}>Programa de pontos</Text>
            <Text style={styles.advantageText}>
              Acumule pontos com suas compras no crédito sem pagar mensalidade!
            </Text>
          </View>
          <View style={styles.advantage}>
            <Image
              source={require("../assets/images/icone_dispositivo.png")}
              style={{ width: 50, height: 50 }}
            />
            <Text style={styles.advantageTitle}>Seguro Dispositivos</Text>
            <Text style={styles.advantageText}>
              Proteja seus dispositivos móveis com uma mensalidade simbólica.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.services}>
            <Text style={styles.footerTitle}>Serviços</Text>
            <Text style={styles.footerText}>Conta corrente</Text>
            <Text style={styles.footerText}>Conta PJ</Text>
            <Text style={styles.footerText}>Cartão de crédito</Text>
          </View>
          <View style={styles.contact}>
            <Text style={styles.footerTitle}>Contato</Text>
            <Text style={styles.footerText}>0800 004 250 08</Text>
            <Text style={styles.footerText}>meajuda@bytebank.com.br</Text>
            <Text style={styles.footerText}>ouvidoria@bytebank.com.br</Text>
          </View>
          <View style={styles.footerLogo}>
            <Text style={styles.footerTitle}>Desenvolvido por Alura</Text>
            <Image
              source={require("../assets/images/icone_logo_rodape.png")}
              style={{ width: 100, height: 40 }}
              resizeMode="contain"
            />
            <Image
              source={require("../assets/images/icone_redes_sociais.png")}
              style={{ width: 150, height: 40, marginTop: 10 }}
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>

      {/* Modal Login */}
      <LoginModal visible={isModalOpen} onClose={() => setIsModalOpen(false)} onLoginSuccess={handleLoginSuccess} />

      {/* Modal Registro */}
      <RegisterModal
        visible={isModalRegisterOpen}
        onClose={() => setIsModalRegisterOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#004D61" },
  loggedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#004D61",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 10,
    backgroundColor: "black",
  },
  menuButton: { fontSize: 28, color: "white" },
  buttonContainer: { flexDirection: "column", gap: 10 },
  button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#47A138",
    marginHorizontal: 5,
  },
  buttonText: { color: "#47A138", textAlign: "center" },
  services: {},
  contact: {},
  secondary: { backgroundColor: "transparent" },
  dropdown: { backgroundColor: "white", padding: 10 },
  navLink: { color: "#47A138", fontSize: 16, marginVertical: 5 },
  main: { padding: 20 },
  blocoCentral: { alignItems: "center", marginVertical: 20 },
  titulo: {
    fontSize: 18,
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  vantagemBanco: {
    textAlign: "center",
    fontSize: 18,
    marginVertical: 10,
    color: "#47A138",
  },
  advantages: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  advantage: { width: 150, margin: 10, alignItems: "center" },
  advantageTitle: {
    color: "#47A138",
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
  },
  advantageText: { textAlign: "center", color: "#767676" },
  footer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "black",
    alignItems: "center",
  },
  footerTitle: {
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 15,
    color: "white",
    textAlign: "center",
  },
  footerLogo: { alignItems: "center", marginTop: 10 },
  footerText: { color: "white", textAlign: "center" },
  welcomeText: { fontSize: 24, color: "white", fontWeight: "bold", marginBottom: 20 },
  logoutButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#47A138",
  },
  logoutText: { color: "white", fontWeight: "bold" },
});
