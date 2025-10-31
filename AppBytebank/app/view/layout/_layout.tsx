import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { Slot } from "expo-router";
import Toast from "react-native-toast-message";

import { AuthProvider } from "@/app/infra/context/AuthContext";
import { store } from "@/app/infra/redux/store";
import { useAppDispatch } from "@/app/infra/redux/hooks";
import { rehydrateUserState } from "@/app/infra/redux/userSlice";

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
