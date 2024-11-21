import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const REST_API_KEY = "9a65039b05d81166bcf8df1dc82404c9";
const REDIRECT_URI = "http://localhost:19006/Home";

const Kakao = () => {
  const navigation = useNavigation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNavigationStateChange = async (navState) => {
    console.log('현재 URL:', navState.url);
    
    if (navState.url.includes("code=") && !isProcessing) {
      setIsProcessing(true);
      try {
        const code = navState.url.split('code=')[1]?.split('&')[0];
        if (!code) throw new Error('인증 코드를 찾을 수 없습니다');

        const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
          body: `grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${code}`,
        });

        const tokenData = await tokenResponse.json();
        
        if (tokenData.access_token) {
          await AsyncStorage.setItem('userToken', tokenData.access_token);
          console.log('액세스 토큰 저장 성공');
          
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        } else {
          throw new Error('토큰 교환 실패');
        }
      } catch (error) {
        console.error('카카오 로그인 오류:', error);
        await AsyncStorage.removeItem('userToken');
        navigation.replace('Home');
      } finally {
        setIsProcessing(false);
      }
    }

    if (navState.code === -6 && navState.url.includes("code=")) {
      return;
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        style={styles.webview}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
        }}
        javaScriptEnabled={true}
        onNavigationStateChange={handleNavigationStateChange}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
});

export default Kakao;
