import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyPage = () => {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState('사용자@example.com');

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        // 토큰이 없으면 로그인 페이지로 이동
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    } catch (error) {
      console.log('로그인 상태 확인 에러:', error);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      console.log('로그아웃 에러:', error);
    }
  };

  // 리뷰 작성 페이지로 이동하는 함수
  const handleReviewPress = () => {
    console.log('리뷰 버튼 클릭');
    navigation.navigate('WriteReview');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerLeft}
          onPress={() => {
            console.log('홈으로 이동 시도');  // 디버깅용
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          }}
        >
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo}
          />
          <Text style={styles.headerTitle}>솜길</Text>
        </TouchableOpacity>
        <Ionicons name="person-circle-outline" size={24} color="black" />
      </View>

      {/* 뒤로가기 버튼 */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* 프로필 섹션 */}
      <TouchableOpacity 
        style={styles.profileSection}
        onPress={() => navigation.navigate('UserInfo')}
      >
        <View style={styles.profileContainer}>
          <Ionicons name="person-circle" size={60} color="black" />
          <View style={styles.userInfo}>
            <Text style={styles.emailText}>{userEmail}</Text>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color="#999"
            style={styles.arrowIcon}
          />
        </View>
      </TouchableOpacity>

      {/* 예약 상태 */}
      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <Text style={styles.statusTitle}>예약중</Text>
          <Text style={styles.statusValue}>0</Text>
        </View>
        <View style={styles.statusDivider} />
        <View style={styles.statusItem}>
          <Text style={styles.statusTitle}>예약완료</Text>
          <Text style={styles.statusValue}>0</Text>
        </View>
        <View style={styles.statusDivider} />
        <View style={styles.statusItem}>
          <Text style={styles.statusTitle}>구매내역</Text>
          <Text style={styles.statusValue}>0</Text>
        </View>
      </View>

      {/* 메뉴 리스트 */}
      <View style={styles.menuList}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('ReservationList')}
        >
          <Ionicons name="bookmark-outline" size={24} color="black" />
          <Text style={styles.menuText}>전체 내역 확인</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleReviewPress}
        >
          <Ionicons name="chatbox-outline" size={24} color="#333" />
          <Text style={styles.menuText}>작성한 리뷰</Text>
          <Ionicons 
            name="chevron-forward-outline" 
            size={24} 
            color="#999"
            style={styles.menuArrow}
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            // 여기에 약관 및 정책 페이지로 이동하는 로직 추가
            // navigation.navigate('Terms') 등
            console.log('약관 및 정책');
          }}
        >
          <Ionicons name="document-text-outline" size={24} color="black" />
          <Text style={styles.menuText}>약관 및 정책</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="black" />
          <Text style={styles.menuText}>로그아웃</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    padding: 10,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  backButton: {
    padding: 15,
  },
  profileSection: {
    padding: 30,
    paddingVertical: 25,
    paddingTop: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    justifyContent: 'space-between',
  },
  userInfo: {
    flex: 1,
    marginLeft: 20,
    marginRight: 10,
  },
  emailText: {
    fontSize: 18,
    color: '#333',
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#eee',
  },
  statusTitle: {
    color: '#666',
    marginBottom: 5,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  menuList: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#f0f8f0',
    marginBottom: 10,
    marginHorizontal: 15,
    borderRadius: 10,
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  menuArrow: {
    marginLeft: 'auto',
  },
});

export default MyPage;