import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { createContext, ReactNode, useContext, useState } from "react";
import { auth } from "../../../firebaseConfig";
import Toast from "react-native-toast-message";
import { getUserById } from "@/app/domain/usecases/util.service";
import { User } from "@/app/domain/entities/user.entity";

interface IAuthContext {
  user: UserCredential | null;
  profile: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (
    username: string,
    password: string
  ) => Promise<UserCredential | void>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserCredential | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      const user = await getUserById(userCredential.user.uid);
      const userProfile: User = {
        userName: user.nome,
        id: userCredential.user.uid,
        saldo: user?.saldo,
        email: userCredential.user.email,
      };

      setProfile(userProfile);
      setIsAuthenticated(true);
      console.info("Usuário logado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        username,
        password
      );
      console.info("Usuário cadastrado com sucesso!");
      return response;
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao cadastrar usuário.",
      });
      console.error("Erro ao cadastrar usuário", error);
      return;
    }
  };

  const logout = () => {
    auth.signOut();
    console.log("Logout chamado, usuário deslogado com sucesso");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        profile,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "Contexto não encontrado, useAuth deve estar dentro de AuthProvider"
    );
  }

  return context;
};

export const ReauthenticateUser = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    if (!auth.currentUser) return false;

    const credentials = EmailAuthProvider.credential(email, password);
    await reauthenticateWithCredential(auth.currentUser, credentials);

    // Se não lançar erro, a senha está correta
    return true;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Senha incorreta ou erro na autenticação.",
    });
    return false;
  }
};
