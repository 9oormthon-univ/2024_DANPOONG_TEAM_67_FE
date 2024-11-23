import React, { useState } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize";
const CLIENT_ID = "4f9210dfadd4560e171c28adee805511";
const REDIRECT_URI = "http://localhost:3000/api/users/login/oauth/kakao";
const BACKEND_URL = "http://3.107.189.243:8080";

const Kakao = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  const handleNavigationStateChange = async (navState) => {
    console.log('=== 카카오 로그인 프로세스 시작 ===');
    console.log('현재 URL:', navState.url);
    
    if (navState.url.includes('/api/users/login/oauth/kakao') && navState.url.includes('code=')) {
      try {
        const code = navState.url.split('code=')[1]?.split('&')[0];
        console.log('인증 코드:', code);
        
        const response = await axios.get(
          `${BACKEND_URL}/api/users/login/kakao`, 
          {
            params: { code },
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );

        console.log('서버 응답 성공:', response.data);

        if (response.data && response.data.token) {
          await AsyncStorage.setItem('userToken', response.data.token);
          await AsyncStorage.setItem('isLoggedIn', 'true');
          
          console.log('토큰 저장 완료');
          console.log('홈 화면으로 이동 시도');

          navigation.reset({
            index: 0,
            routes: [{ 
              name: 'Home', 
              params: { 
                isLoggedIn: true, 
                refresh: true 
              }
            }],
          });
          return false;
        }
      } catch (error) {
        console.log('=== 에러 발생 ===');
        console.log('에러 내용:', error);
        navigation.navigate('Home');
      }
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <WebView
        style={styles.webview}
        source={{
          uri: `${KAKAO_AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`,
          method: 'GET'
        }}
        javaScriptEnabled={true}
        onNavigationStateChange={handleNavigationStateChange}
        domStorageEnabled={true}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          navigation.navigate('Home');
        }}
        renderError={() => <View />}
      />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

export default Kakao;
