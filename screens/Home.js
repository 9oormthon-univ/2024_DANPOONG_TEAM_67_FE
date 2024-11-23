import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// 패키지 타입 상수 정의 - API 명세에 맞게 수정
const PACKAGE_TYPES = {
  LOCAL: "LOCAL",      // 현지인 코스
  HIDDEN: "HIDDEN",    // 숨겨진 명소 코스
  THEME: "THEME"       // 테마 코스
};

const Home = ({ route, navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [packageList, setPackageList] = useState([]);

  // 앱 시작시 로그인 상태 확인
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // 패키지 리스트 불러오기
  const fetchPackagesByType = async (type) => {
    try {
      setLoading(true);
      const url = `http://3.107.189.243:8080/api/package/list?sort=reviewRating&type=${type}`;
      console.log('요청 URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('에러 응답:', errorText);
        throw new Error(`API 에러 - 상태 코드: ${response.status}, 메시지: ${errorText}`);
      }

      const data = await response.json();
      console.log('받은 데이터:', data);

      if (!data || data.length === 0) {
        console.log(`${type} 타입의 패키지 데이터가 없습니다.`);
        Alert.alert('알림', '해당 타입의 패키지가 없습니다.');
        return;
      }

      // Package1 화면으로 이동하면서 패키지 타입과 데이터를 전달
      navigation.navigate('Package1', {
        packageType: type,
        packageTitle: getPackageTitle(type),
        packageList: data
      });

    } catch (error) {
      console.log('=== 에러 상세 정보 ===');
      console.log('에러 메시지:', error.message);
      Alert.alert('오류', '패키지 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 패키지 타입별 제목 반환
  const getPackageTitle = (type) => {
    switch(type) {
      case PACKAGE_TYPES.LOCAL:
        return '현지인 코스';
      case PACKAGE_TYPES.HIDDEN:
        return '숨겨진 명소 코스';
      case PACKAGE_TYPES.THEME:
        return '테마 코스';
      default:
        return '패키지';
    }
  };

  // 로그인 상태 체크 함수 수정
  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const isLoggedInStatus = await AsyncStorage.getItem('isLoggedIn');
      console.log('=== 로그인 상태 체크 시작 ===');
      console.log('토큰:', userToken);
      console.log('로그인 상태:', isLoggedInStatus);
      
      if (!userToken) {
        console.log('로그인 실패: 토큰이 존재하지 않습니다.');
        setIsLoggedIn(false);
        return;
      }

      if (isLoggedInStatus !== 'true') {
        console.log('로그인 실패: 로그인 상태가 true가 아닙니다.');
        setIsLoggedIn(false);
        return;
      }

      console.log('로그인 성공: 토큰과 로그인 상태가 모두 유효합니다.');
      setIsLoggedIn(true);
      
    } catch (error) {
      console.log('=== 로그인 상태 체크 에러 ===');
      console.log('에러 타입:', error.name);
      console.log('에러 메시지:', error.message);
      setIsLoggedIn(false);
    } finally {
      console.log('=== 로그인 상태 체크 완료 ===');
    }
  };

  // 화면 포커스될 때마다 로그인 상태 확인
  useFocusEffect(
    React.useCallback(() => {
      checkLoginStatus();
    }, [])
  );

  // route.params 변경 감지
  useEffect(() => {
    if (route.params?.refresh || route.params?.isLoggedIn) {
      checkLoginStatus();
    }
  }, [route.params]);

  // 컴포넌트 마운트 시 최초 1회 실행
  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <View style={{ flex: 1 }}>
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
            onPress={() => {
              if (isLoggedIn) {
                navigation.navigate('MyPage');
              } else {
                navigation.navigate('Kakao');
              }
            }}
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

        {/* 검색바 */}
        <View style={styles.searchContainer}>
          <Image
            source={require('../assets/homeassist.png')}
            style={styles.assistImage}
            resizeMode="contain"
          />
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

        {/* 서비스 메뉴 */}
        <View style={styles.serviceMenu}>
          <Text style={styles.sectionTitle}>패키지</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => fetchPackagesByType(PACKAGE_TYPES.LOCAL)}
          >
            <Ionicons name="leaf-outline" size={24} color="black" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>현지인 코스</Text>
              <Text style={styles.menuSubtitle}>현지인 분께서 관광지 오마카세를 선물합니다.</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => fetchPackagesByType(PACKAGE_TYPES.HIDDEN)}
          >
            <Ionicons name="map" size={24} color="black" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>숨겨진 명소 코스</Text>
              <Text style={styles.menuSubtitle}>숨은 명소를 속들이 찾아드립니다!</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => fetchPackagesByType(PACKAGE_TYPES.THEME)}
          >
            <Ionicons name="people-outline" size={24} color="black" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>테마 코스</Text>
              <Text style={styles.menuSubtitle}>혼자, 친구와 함께, 연인과 함께</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 추천 패키지 섹션을 맨 아래로 이동 */}
        <View style={[styles.recommendSection, styles.lastSection]}>
          <Text style={styles.sectionTitle}>추천 상품</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {loading ? (
              <Text>로딩 중...</Text>
            ) : packageList.length > 0 ? (
              packageList.map((pkg, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.recommendCard}
                  onPress={() => navigation.navigate('Detail', { itemId: pkg.id })}
                >
                  {pkg.recommended && <Text style={styles.cardLabel}>MD 추천</Text>}
                  <Text style={styles.cardTitle}>{pkg.name}</Text>
                  <Text style={styles.cardSubtitle}>{pkg.description}</Text>
                  <View style={styles.timeInfo}>
                    <Ionicons name="time-outline" size={16} color="white" />
                    <Text style={styles.timeText}>
                      {`${pkg.startTime?.hour || '00'}:${pkg.startTime?.minute || '00'} - ${pkg.endTime?.hour || '00'}:${pkg.endTime?.minute || '00'}`}
                    </Text>
                  </View>
                  {pkg.courses && pkg.courses[0] && (
                    <Text style={styles.regionText}>{pkg.courses[0].region}</Text>
                  )}
                  {pkg.tags && (
                    <View style={styles.tagContainer}>
                      {pkg.tags.map((tag, tagIndex) => (
                        <Text key={tagIndex} style={styles.tagText}>#{tag}</Text>
                      ))}
                    </View>
                  )}
                  {pkg.price && (
                    <Text style={styles.priceText}>₩{pkg.price.toLocaleString()}</Text>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>현재 추천 상품을 불러올 수 없습니다.</Text>
                <Text style={styles.errorSubText}>잠시 후 다시 시도해주세요.</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </ScrollView>

      {/* 예약하기 버튼 */}
      <TouchableOpacity 
        style={styles.reservationButton}
        onPress={() => navigation.navigate('Reservation')}
      >
        <View style={styles.buttonContent}>
          <Ionicons name="car" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>솜카 이용 예약하기</Text>
          <Ionicons name="chevron-forward" size={24} color="white" />
        </View>
      </TouchableOpacity>
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
    paddingTop: 0,
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
    height: 180,
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
    fontSize: 14,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  timeText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 14,
  },
  regionText: {
    color: '#4CAF50',
    marginTop: 10,
    fontSize: 14,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tagText: {
    color: '#666',
    marginRight: 5,
    fontSize: 12,
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
  loginButton: {
    padding: 5,  // 터치 영역 확보
  },
  assistImage: {
    width: '100%',
    height: 50,
    marginBottom: 8,
  },
  errorContainer: {
    width: 300,
    height: 180,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  priceText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  lastSection: {
    marginBottom: 20, // 마지막 섹션 아래 여백 추가
  },
  reservationButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',  // 초록색 계열
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,  // 텍스트가 아이콘들 사이에서 늘어나도록
  },
});

export default Home;