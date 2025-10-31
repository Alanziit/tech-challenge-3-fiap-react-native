import { ActivityIndicator, StyleSheet, View, Text } from "react-native";

interface LoaderProps {
    message?: string;
    size: "small" | "large";
}

export default function Loader({message,size}:LoaderProps) {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size={size} color="#4CAF50" />
      {message && <Text>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    marginTop: 20,
    alignItems: "center",
  },
});
