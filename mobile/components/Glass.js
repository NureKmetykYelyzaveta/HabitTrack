import { View, StyleSheet } from "react-native";
import { colors } from "../theme";

export default function Glass({ children, style }) {
  return <View style={[styles.glass, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  glass: {
    backgroundColor: colors.glass,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
});
