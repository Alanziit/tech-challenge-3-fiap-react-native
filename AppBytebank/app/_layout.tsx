import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { Slot } from "expo-router";
import Toast from "react-native-toast-message";
import { useAppDispatch } from "@/infra/redux/hooks";
import { rehydrateUserState } from "@/infra/redux/userSlice";
import store from "@/infra/redux/store";
import { AuthProvider } from "@/infra/context/AuthContext";


/**
 * 🔹 Este componente inicializa o Redux com dados do cache local.
 */
function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("♻️ Re-hidratando Redux com dados do cache...");
    dispatch(rehydrateUserState());
  }, [dispatch]);

  return <>{children}</>;
}

export default function Layout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppInitializer>
          <Slot />
          <Toast />
        </AppInitializer>
      </AuthProvider>
    </Provider>
  );
}
