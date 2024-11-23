import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PackageDetail = ({ route, navigation }) => {
  const { packageId } = route.params;
  const [packageData, setPackageData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
    fetchPackageDetail();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(userToken !== null);
    } catch (error) {
      console.log('로그인 상태 체크 에러:', error);
    }
  };

  const handleAuthPress = () => {
    if (isLoggedIn) {
      navigation.navigate('MyPage');
    } else {
      navigation.navigate('Kakao', {
        returnScreen: 'PackageDetail',
        returnParams: { packageId: packageId }
      });
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>패키지 상세정보</Text>
        </View>
        <TouchableOpacity 
          onPress={handleAuthPress}
          style={styles.loginButton}
        >
          {isLoggedIn ? (
            <Ionicons 
              name="person-circle-outline" 
              size={28} 
              color="black"
            />
          ) : (
            <Text style={styles.loginText}>로그인</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const fetchPackageDetail = async () => {
    try {
      setLoading(true);
      console.log('=== 패키지 상세 정보 요청 시작 ===');
      
      if (!packageId) {
        throw new Error('packageId가 없습니다');
      }

      const requestBody = {
        packageId: String(packageId)
      };
      
      console.log('요청 URL:', 'http://3.107.189.243:8080/api/package/details');
      console.log('요청 Body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch('http://3.107.189.243:8080/api/package/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('응답 상태:', response.status);
      const responseText = await response.text();
      console.log('응답 전체:', responseText);

      if (!response.ok) {
        throw new Error(`API 에러 - 상태 코드: ${response.status}, 메시지: ${responseText}`);
      }

      const data = JSON.parse(responseText);
      console.log('=== 파싱된 응답 데이터 ===');
      console.log(JSON.stringify(data, null, 2));
      setPackageData(data);

    } catch (error) {
      console.log('=== 에러 상세 정보 ===');
      console.log('에러 타입:', error.name);
      console.log('에러 메시지:', error.message);
      console.log('에러 스택:', error.stack);
      Alert.alert('오류', '패키지 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReservation = () => {
    AsyncStorage.getItem('userToken').then(userToken => {
      if (!userToken) {
        Alert.alert('알림', '로그인이 필요한 서비스입니다.', [
          {
            text: '로그인하기',
            onPress: () => navigation.navigate('Kakao')
          },
          {
            text: '취소',
            style: 'cancel'
          }
        ]);
        return;
      }

      navigation.navigate('PackageOrder', {
        packageId: route.params?.packageId,
        packageName: route.params?.packageName,
        price: route.params?.price,
      });
    });
  };

  if (loading) {
    return (
      <ScrollView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <Text>로딩 중...</Text>
        </View>
      </ScrollView>
    );
  }

  if (!packageData) {
    return (
      <ScrollView style={styles.container}>
        {renderHeader()}
        <View style={styles.errorContainer}>
          <Text>패키지 정보를 불러올 수 없습니다.</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {!loading && packageData && (
        <View style={styles.content}>
          <Image 
            source={{ uri: packageData.imageUrl }} 
            style={styles.packageImage} 
          />
          <View style={styles.packageInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.packageTitle}>{packageData.name}</Text>
              <TouchableOpacity style={styles.reserveButton} onPress={handleReservation}>
                <Text style={styles.reserveText}>예약하기</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>★★★★★</Text>
              <Text style={styles.reviewCount}>(384)</Text>
            </View>
          </View>
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>상품가격</Text>
            <Text style={styles.price}>성인 {packageData.price?.toLocaleString()}원</Text>
            <Text style={styles.price}>아동 180,000원</Text>
            <Text style={styles.price}>유아 90,000원</Text>
          </View>
          <View style={styles.scheduleSection}>
            <Text style={styles.sectionTitle}>상세일정</Text>
            <View style={styles.scheduleBox}>
              <Text style={styles.dayTitle}>1일차</Text>
              <Text style={styles.scheduleItem}>11:40 - 제주공항 도착</Text>
              <Text style={styles.scheduleItem}>12:20 - 숨길 탑승</Text>
              <Text style={styles.scheduleItem}>13:00 - 현지인 추천 식당에서</Text>
              <Text style={styles.scheduleItem}>점심 식사 (산방식당)</Text>
              {/* ... 나머지 일정 ... */}
            </View>
          </View>
          <View style={styles.noticeSection}>
            <Text style={styles.sectionTitle}>이용약관</Text>
            <View style={styles.noticeBox}>
              <Text style={styles.noticeText}>30일 이내 환불시 ~~</Text>
            </View>
          </View>
          <View style={styles.reviewSection}>
            <Text style={styles.sectionTitle}>리뷰</Text>
            {/* 리뷰 컴포넌트 */}
          </View>
        </View>
      )}
      <TouchableOpacity 
        style={styles.reservationButton}
        onPress={handleReservation}
      >
        <Text style={styles.reservationButtonText}>예약하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loginButton: {
    padding: 5,
  },
  loginText: {
    fontSize: 16,
    color: '#4CAF50',
    textDecorationLine: 'underline',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  priceContainer: {
    marginVertical: 10,
  },
  scheduleContainer: {
    marginTop: 15,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  reserveButton: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginLeft: 10,
  },
  reserveText: {
    color: '#4CAF50',
    fontWeight: '500',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  dayContainer: {
    marginVertical: 10,
  },
  activity: {
    fontSize: 16,
    marginVertical: 5,
  },
  packageImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  packageInfo: {
    padding: 15,
  },
  packageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rating: {
    color: '#FFB800',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 5,
  },
  reviewCount: {
    fontSize: 16,
    color: '#666',
  },
  priceSection: {
    marginBottom: 15,
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    marginBottom: 5,
  },
  scheduleSection: {
    marginBottom: 15,
  },
  scheduleBox: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    padding: 10,
  },
  scheduleItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  noticeSection: {
    marginBottom: 15,
  },
  noticeBox: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    padding: 10,
  },
  noticeText: {
    fontSize: 16,
    color: '#666',
  },
  reviewSection: {
    marginBottom: 15,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reservationButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  reservationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PackageDetail;