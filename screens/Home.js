import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// 패키지 타입 상수 정의 - API 명세에 맞게 수정
const PACKAGE_TYPES = {
  HEALING: "HEALING",   // 힐링
  COUPLE: "COUPLE",     // 연인
  ACTIVITY: "ACTIVITY", // 액티비티
  RETRO: "RETRO",      // 레트로
  GOLMOK: "GOLMOK",    // 골목
  LOCAL: "LOCAL",       // 현지인
  THEME: "THEME",       // 사진
  SHIP: "SHIP"         // 섬
};

const Home = ({ route, navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [packageList, setPackageList] = useState([]);
  const [recommendedPackages, setRecommendedPackages] = useState([]);
  const [recommendLoading, setRecommendLoading] = useState(true);

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
      case PACKAGE_TYPES.HEALING:
        return '힐링';
      case PACKAGE_TYPES.COUPLE:
        return '연인';
      case PACKAGE_TYPES.ACTIVITY:
        return '액티비티';
      case PACKAGE_TYPES.RETRO:
        return '레트로';
      case PACKAGE_TYPES.GOLMOK:
        return '골목';
      case PACKAGE_TYPES.LOCAL:
        return '현지인';
      case PACKAGE_TYPES.THEME:
        return '사진';
      case PACKAGE_TYPES.SHIP:
        return '섬';
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

  // 추천 패키지 불러오기 함수 추가
  const fetchRecommendedPackages = async () => {
    try {
      setRecommendLoading(true);
      const url = 'http://3.107.189.243:8080/api/package/recommended';
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`API 에러 - 상태 코드: ${response.status}`);
      }

      const data = await response.json();
      setRecommendedPackages(data);
    } catch (error) {
      console.log('추천 패키지 로딩 에러:', error);
    } finally {
      setRecommendLoading(false);
    }
  };

  // 컴포넌트 마운트 시 추천 패키지 로드
  useEffect(() => {
    fetchRecommendedPackages();
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

        {/* 색바 */}
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
          <View style={styles.packageGrid}>
            <TouchableOpacity 
              style={styles.packageItem}
              onPress={() => fetchPackagesByType(PACKAGE_TYPES.HEALING)}
            >
              <Ionicons name="leaf" size={24} color="#4CAF50" />
              <Text style={styles.packageItemText}>힐링</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.packageItem}
              onPress={() => fetchPackagesByType(PACKAGE_TYPES.COUPLE)}
            >
              <Ionicons name="heart" size={24} color="#E91E63" />
              <Text style={styles.packageItemText}>연인</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.packageItem}
              onPress={() => fetchPackagesByType(PACKAGE_TYPES.ACTIVITY)}
            >
              <Ionicons name="bicycle" size={26} color="#3c18a4" />
              <Text style={styles.packageItemText}>액티비티</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.packageItem}
              onPress={() => fetchPackagesByType(PACKAGE_TYPES.RETRO)}
            >
              <Ionicons name="time-outline" size={24} color="#86440d" />
              <Text style={styles.packageItemText}>레트로</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.packageItem}
              onPress={() => fetchPackagesByType(PACKAGE_TYPES.GOLMOK)}
            >
              <Ionicons name="map-outline" size={24} color="#cfb74d" />
              <Text style={styles.packageItemText}>골목</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.packageItem}
              onPress={() => fetchPackagesByType(PACKAGE_TYPES.LOCAL)}
            >
              <Ionicons name="person" size={24} color="#08227b" />
              <Text style={styles.packageItemText}>현지인</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.packageItem}
              onPress={() => fetchPackagesByType(PACKAGE_TYPES.THEME)}
            >
              <Ionicons name="camera" size={24} color="#696664" />
              <Text style={styles.packageItemText}>사진</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.packageItem}
              onPress={() => fetchPackagesByType(PACKAGE_TYPES.SHIP)}
            >
              <Ionicons name="boat-outline" size={24} color="#008ce6" />
              <Text style={styles.packageItemText}>섬</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 추약하기 버튼 위치 이동 */}
        <TouchableOpacity 
          style={[styles.reservationButton, { marginHorizontal: 20, marginVertical: 15 }]}
          onPress={() => navigation.navigate('Reservation')}
        >
          <View style={styles.buttonContent}>
            <View style={styles.buttonLeft}>
              <Ionicons name="car" size={24} color="black" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>솜카 이용 예약하기</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="black" />
          </View>
        </TouchableOpacity>

        {/* 추천 패키지 섹션 */}
        <View style={[styles.recommendSection, styles.lastSection]}>
          <Text style={styles.sectionTitle}>추천 상품</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendLoading ? (
              <Text>로딩 중...</Text>
            ) : recommendedPackages.length > 0 ? (
              recommendedPackages.map((pkg, index) => (
                <TouchableOpacity 
                  key={`${pkg.id}_${index}`} 
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
                        <Text 
                          key={`${pkg.id}_tag_${tagIndex}`} 
                          style={styles.tagText}
                        >
                          #{tag}
                        </Text>
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
                <Text style={styles.errorText}>추천 상품이 없습니다.</Text>
                <Text style={styles.errorSubText}>나중에 다시 확인해주세요.</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </ScrollView>
      
      {/* 하단 탭 바 추가 */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home-outline" size={24} color="#4CAF50" />
          <Text style={[styles.tabText, styles.tabTextActive]}>홈</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search-outline" size={24} color="#666" />
          <Text style={styles.tabText}>검색</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => navigation.navigate('ReservationList')}
        >
          <Ionicons name="calendar-outline" size={24} color="#666" />
          <Text style={styles.tabText}>예약정보</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => {
            if (isLoggedIn) {
              navigation.navigate('MyPage');
            } else {
              navigation.navigate('Kakao');
            }
          }}
        >
          <Ionicons name="person-outline" size={24} color="#666" />
          <Text style={styles.tabText}>마이페이지</Text>
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
    backgroundColor: '#E8F5E9',
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
    paddingHorizontal: 10,
  },
  buttonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',  // 가운데 정렬
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
    paddingBottom: 8, // 아이폰 하단 여백 고려
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 3,
    color: '#666',
  },
  tabTextActive: {
    color: '#4CAF50',
  },
  packageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  packageItem: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  packageItemText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Home;