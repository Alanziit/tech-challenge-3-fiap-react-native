import LoginModal from "@/app/view/components/LoginModal/LoginModal";
import RegisterModal from "@/app/view/components/RegisterModal/RegisterModal";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import UserHome from "@/app/view/components/UserHome/UserHome";
import Loading from "@/app/view/components/Loading/Loading";
import { useAuth } from "@/app/infra/context/AuthContext";
import styles from "./styles";


export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { logout } = useAuth();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  // Função chamada pelo LoginModal quando o login for bem-sucedido
  const handleLoginSuccess = () => {
    setLoading(true);
    setIsModalOpen(false);

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  if (isLoading) {
    return <Loading />;
  }

  // Tela principal quando o usuário está logado
  if (isAuthenticated) {
    return <UserHome onLogout={() => logout()} />;
  }

  // Tela padrão (home) quando não há usuário logado
  return (
    <>
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
                <Text style={styles.vantagemBanco}>
                  Vantagens do nosso banco:
                </Text>
              </>
            )}

            {/* Advantages */}
            <View style={styles.advantages}>
              <View style={styles.advantage}>
                <Image
                  source={require("../assets/images/icone_presente.png")}
                  style={{ width: 50, height: 50 }}
                />
                <Text style={styles.advantageTitle}>
                  Conta e cartão gratuitos
                </Text>
                <Text style={styles.advantageText}>
                  Nossa conta é digital, sem custo fixo e sem tarifa de
                  manutenção.
                </Text>
              </View>
              <View style={styles.advantage}>
                <Image
                  source={require("../assets/images/icone_saque.png")}
                  style={{ width: 50, height: 50 }}
                />
                <Text style={styles.advantageTitle}>Saques sem custo</Text>
                <Text style={styles.advantageText}>
                  Você pode sacar gratuitamente 4x por mês de qualquer Banco
                  24h.
                </Text>
              </View>
              <View style={styles.advantage}>
                <Image
                  source={require("../assets/images/icone_estrela.png")}
                  style={{ width: 50, height: 50 }}
                />
                <Text style={styles.advantageTitle}>Programa de pontos</Text>
                <Text style={styles.advantageText}>
                  Acumule pontos com suas compras no crédito sem pagar
                  mensalidade!
                </Text>
              </View>
              <View style={styles.advantage}>
                <Image
                  source={require("../assets/images/icone_dispositivo.png")}
                  style={{ width: 50, height: 50 }}
                />
                <Text style={styles.advantageTitle}>Seguro Dispositivos</Text>
                <Text style={styles.advantageText}>
                  Proteja seus dispositivos móveis com uma mensalidade
                  simbólica.
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
          <LoginModal
            visible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />

          {/* Modal Registro */}
          <RegisterModal
            visible={isModalRegisterOpen}
            onClose={() => setIsModalRegisterOpen(false)}
          />
        </View>
    </>
  );
}


