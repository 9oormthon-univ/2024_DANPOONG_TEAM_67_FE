import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Package1 = ({ route }) => {
  const navigation = useNavigation();
  const { packageType, packageTitle, packageList } = route.params;
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
    if (packageList) {
      setPackages(packageList);
      setLoading(false);
    }
  }, [packageList]);

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
      console.log('=== Package1에서 Kakao로 이동 ===');
      console.log('현재 route.params:', route.params);
      
      // 명시적으로 현재 화면 정보와 파라미터 전달
      const currentParams = {
        packageType: packageType,
        packageTitle: packageTitle,
        packageList: packageList
      };
      
      console.log('전달할 파라미터:', currentParams);
      
      navigation.navigate('Kakao', {
        returnScreen: 'Package1',
        returnParams: currentParams
      });
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo}
          />
          <Text style={styles.logoText}>솜길</Text>
        </View>
        <TouchableOpacity onPress={handleAuthPress}>
          <Text style={styles.loginText}>로그인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderHeader()}

      <View style={styles.packagesContainer}>
        {loading ? (
          <Text style={styles.loadingText}>로딩 중...</Text>
        ) : packages.length > 0 ? (
          <View style={styles.gridContainer}>
            {packages.map((pkg, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.packageCard}
                onPress={() => {
                  if (!pkg.packageId) {
                    Alert.alert('오류', '패키지 정보가 올바르지 않습니다.');
                    return;
                  }
                  navigation.navigate('Detail', { packageId: pkg.packageId });
                }}
              >
                <View style={styles.packageImage}>
                  {pkg.image1 ? (
                    <Image 
                      source={{ uri: pkg.image1 }}
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <View style={[styles.packageImage, { backgroundColor: '#f0f0f0' }]} />
                  )}
                </View>
                <View style={styles.packageInfo}>
                  <Text style={styles.packageTitle} numberOfLines={1}>{pkg.name}</Text>
                  <Text style={styles.reviewInfo}>★{pkg.reviewRating || 0}</Text>
                </View>
                <Text style={styles.packagePrice}>
                  ₩{pkg.price?.toLocaleString() || '가격 정보 없음'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText}>
            {packageTitle}에 해당하는 패키지가 없습니다.
          </Text>
        )}
      </View>
    </ScrollView>
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
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loginText: {
    fontSize: 16,
    color: '#4CAF50',
    textDecorationLine: 'underline',
  },
  packagesContainer: {
    padding: 15,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  packageCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  packageImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  packageInfo: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  packagePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  reviewInfo: {
    fontSize: 14,
    color: '#FFA000',
    marginLeft: 5,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default Package1;