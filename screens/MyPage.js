import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
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

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo}
          />
          <Text style={styles.headerTitle}>솜길</Text>
        </View>
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
      <View style={styles.profileSection}>
        <Ionicons name="person-circle" size={60} color="black" />
        <Text style={styles.emailText}>{userEmail}</Text>
      </View>

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

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={24} color="black" />
          <Text style={styles.menuText}>회원 정보 변경</Text>
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

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="close-circle-outline" size={24} color="black" />
          <Text style={styles.menuText}>회원탈퇴</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
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
    alignItems: 'center',
    marginVertical: 20,
  },
  emailText: {
    fontSize: 16,
    marginTop: 10,
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
    padding: 15,
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
});

export default MyPage;