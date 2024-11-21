import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const Home = ({ route }) => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 앱 시작시 무조건 실행
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('현재 토큰 상태:', userToken);
      setIsLoggedIn(!!userToken);
    } catch (error) {
      console.log('토큰 확인 에러:', error);
      setIsLoggedIn(false);
    }
  };

  // 화면 포커스될 때마다 실행
  useFocusEffect(
    React.useCallback(() => {
      const checkLoginStatus = async () => {
        try {
          const userToken = await AsyncStorage.getItem('userToken');
          console.log('현재 토큰 상태:', userToken);
          
          // 토큰이 있더라도 유효성 검사
          if (userToken) {
            // 카카오 토큰 유효성 검사 API 호출
            try {
              const response = await fetch('https://kapi.kakao.com/v1/user/access_token_info', {
                headers: {
                  'Authorization': `Bearer ${userToken}`
                }
              });
              
              if (response.status === 200) {
                setIsLoggedIn(true);
              } else {
                // 토큰이 유효하지 않으면 삭제
                await AsyncStorage.removeItem('userToken');
                setIsLoggedIn(false);
              }
            } catch (error) {
              console.log('토큰 검증 실패:', error);
              setIsLoggedIn(false);
            }
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.log('토큰 확인 에러:', error);
          setIsLoggedIn(false);
        }
      };

      checkLoginStatus();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.profileImage}
          />
          <Text style={styles.headerTitle}>솜길</Text>
        </View>
        <TouchableOpacity 
          onPress={() => isLoggedIn ? navigation.navigate('MyPage') : navigation.navigate('Kakao')}
          style={styles.loginButton}
        >
          <Text style={styles.loginText}>
            {isLoggedIn ? '마이페이지' : '로그인'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 검색바 */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchTitle}>"     솜길 소개     "</Text>
        <View style={styles.searchBar}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Reservation')}
            style={styles.searchInput}
          >
            <Text style={styles.placeholderText}>어떤 기사님을 원하시나요?</Text>
          </TouchableOpacity>
          <Ionicons name="search" size={24} color="black" />
        </View>
      </View>

      {/* 추천 상품 섹션 */}
      <View style={styles.recommendSection}>
        <Text style={styles.sectionTitle}>추천 상품</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.recommendCard}>
            <Text style={styles.cardLabel}>MD 추천</Text>
            <Text style={styles.cardTitle}>부산 여행 패키지</Text>
            <Text style={styles.cardSubtitle}>0박 0일</Text>
          </View>

          <View style={styles.recommendCard}>
            <Text style={styles.cardLabel}>MD 추천</Text>
            <Text style={styles.cardTitle}>여수 여행 패키지</Text>
            <Text style={styles.cardSubtitle}>2박 3일</Text>
          </View>
    
          <View style={styles.recommendCard}>
            <Text style={styles.cardLabel}>MD 추천</Text>
            <Text style={styles.cardTitle}>강원도 여행 패키지</Text>
            <Text style={styles.cardSubtitle}>3박 4일</Text>
          </View>
        </ScrollView>
      </View>

      {/* 서비스 메뉴 */}
      <View style={styles.serviceMenu}>
      <Text style={styles.sectionTitle}>패키지</Text>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('MyPage')}
        >
          <Ionicons name="car" size={24} color="black" />
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>현지인 코스</Text>
            <Text style={styles.menuSubtitle}>현지인 분께서 관광지 오마카세를 선물합니다.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Package1')}
        >
          <Ionicons name="map" size={24} color="black" />
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>숨겨진 명소 코스</Text>
            <Text style={styles.menuSubtitle}>숨은 명소를 속속들이 찾아드립니다!</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('MyPage')}
        >
          <Ionicons name="people-outline" size={24} color="black" />
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>테마 코스</Text>
            <Text style={styles.menuSubtitle}>혼자, 친구와 함께, 연인과 함께</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loginText: {
    color: '#2196F3',
  },
  searchContainer: {
    padding: 15,
  },
  searchTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
    fontSize: 16,
  },
  recommendSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recommendCard: {
    width: 300,
    height: 150,
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
  },
  cardLabel: {
    color: 'white',
    backgroundColor: '#2E7D32',
    alignSelf: 'flex-start',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: 'white',
    marginTop: 5,
  },
  serviceMenu: {
    padding: 15,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  menuTextContainer: {
    marginLeft: 15,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuSubtitle: {
    color: '#666',
    marginTop: 5,
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
  },
});

export default Home;