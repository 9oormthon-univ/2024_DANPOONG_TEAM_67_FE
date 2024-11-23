import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const UserInfo = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Image 
              source={require('../assets/logo.png')} 
              style={styles.logo}
            />
            <Text style={styles.logoText}>솜길</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('MyPage')}>
            <Ionicons name="person-circle-outline" size={28} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerBottom}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>내 정보 관리</Text>
        </View>
      </View>

      {/* 프로필 섹션 */}
      <View style={styles.profileSection}>
        <Ionicons name="person-circle" size={80} color="black" />
        <View style={styles.nameSection}>
          <Text style={styles.userName}>사용자</Text>
          <TouchableOpacity>
            <Ionicons name="pencil" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 기본정보 섹션 */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>기본정보</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>회원번호</Text>
          <Text style={styles.infoValue}>548123</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>휴대폰</Text>
          <Text style={styles.infoValue}>010-1234-5678</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>이메일</Text>
          <Text style={styles.infoValue}>somsom3@kakao.com</Text>
        </View>
      </View>

      {/* 회원탈퇴 버튼 */}
      <TouchableOpacity style={styles.withdrawalButton}>
        <Text style={styles.withdrawalText}>회원탈퇴</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    marginRight: 10,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  infoSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    width: 80,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    color: '#333',
  },
  withdrawalButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  withdrawalText: {
    color: '#FF3B30',
    fontSize: 16,
  },
});

export default UserInfo;