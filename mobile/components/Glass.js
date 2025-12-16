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
    borderColor: "rgba(0, 255, 136, 0.15)",
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
  },
});
