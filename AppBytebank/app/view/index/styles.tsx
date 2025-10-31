import {
  StyleSheet
} from "react-native";


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
  welcomeText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  logoutButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#47A138",
  },
  logoutText: { color: "white", fontWeight: "bold" },
});

export default styles;