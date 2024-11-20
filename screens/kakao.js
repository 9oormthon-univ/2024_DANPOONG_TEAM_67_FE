import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";

const REST_API_KEY = "9a65039b05d81166bcf8df1dc82404c9";
const REDIRECT_URI = "http://localhost:19006/Home";

const Kakao = () => {
  const navigation = useNavigation();
  const [hasNavigated, setHasNavigated] = useState(false);

  const handleNavigationStateChange = (navState) => {
    try {
      if (navState.url.includes("/Home")) {
        const exp = "code=";
        const code = navState.url.split(exp)[1];
        if (code && !hasNavigated) {
          console.log("인증 코드:", code);
          setHasNavigated(true);
          navigation.navigate("Home", { isLoggedIn: true });
        }
      }
    } catch (error) {
      console.error("인증 처리 중 오류 발생:", error);
    }
  };

  return (
    <View style={Styles.container}>
      <WebView
        style={Styles.webview}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
        }}
        javaScriptEnabled={true}
        onNavigationStateChange={handleNavigationStateChange}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
      />
    </View>
  );
};

export default Kakao;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
});
