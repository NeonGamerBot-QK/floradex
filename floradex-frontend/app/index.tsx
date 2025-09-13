import { Text, View, StyleSheet } from "react-native";
import { useFonts, Jua_400Regular } from "@expo-google-fonts/jua";

export default function Index() {
  console.log(Jua_400Regular);

  let [fontsLoaded] = useFonts({
    Jua_400Regular, // Import specific font styles
  });

  if (!fontsLoaded) {
    return (
      <View>
        <Text>loading...</Text>
      </View>
    ); // Or show a loading screen
  }

  return (
    <View style={{ ...styles.container, width: "1/2" }}>
      <Text style={{ fontSize: 72, ...styles.text }}>
        flora<Text style={{ ...styles.text, color: "#F8F991" }}>dex</Text>
      </Text>

      <Text style={{ ...styles.text, justifySelf: "right" }}>
        gamifying grass gandering and gambling
      </Text>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          gap: 10,
        }}
      >
        <Text
          style={{
            ...styles.text,
            padding: 3,
            backgroundColor: "#F8F991",
            color: "#708B75",
            borderRadius: 3,
            height: "7.5%",
            text: "center",
            alignItems: "center",
          }}
        >
          Signup
        </Text>
        <Text
          style={{
            ...styles.text,
            padding: 3,
            backgroundColor: "#708B75",
            color: "#F8F991",
            borderRadius: 3,
            height: "7.5%",
            text: "center",
            alignItems: "center",
          }}
        >
          Login
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9ab87a",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#3D315B",
    fontFamily: "Jua_400Regular",
  },
});
