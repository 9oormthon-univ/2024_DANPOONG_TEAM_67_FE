import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const PackageDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { itemId } = route.params;
  const [packageData, setPackageData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      checkLoginStatus();
    }, [])
  );

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
      navigation.navigate('Kakao');
    }
  };

  const renderHeader = () => (
    <View>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo}
          />
          <Text style={styles.logoText}>솜길</Text>
        </View>
        <TouchableOpacity onPress={handleAuthPress}>
          <Text style={styles.loginText}>
            {isLoggedIn ? '마이페이지' : '로그인'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.headerBottom}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  useEffect(() => {
    // 임시 데이터 예시:
    const tempData = {
      id: itemId,
      title: '제주의 보석',
      imageUrl: require('../assets/icon.png'),
      adultPrice: 250000,
      childPrice: 180000,
      infantPrice: 90000,
      schedule: [
        {
          day: "1일차",
          activities: [
            "11:40 - 제주공항 도착",
            "12:20 - 중식",
            "14:00 - 협재해수욕장",
          ]
        }
      ]
    };
    setPackageData(tempData);
  }, [itemId]);

  if (!packageData) {
    return <View><Text>로딩 중...</Text></View>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      <View style={styles.container}>
        <Image source={packageData.imageUrl} style={styles.image} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{packageData.title}</Text>
          <TouchableOpacity 
            style={styles.reserveButton}
            onPress={() => navigation.navigate('PackageOrder', { packageId: itemId })}
          >
            <Text style={styles.reserveButtonText}>예약하기</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.priceContainer}>
          <Text>성인: {packageData.adultPrice}원</Text>
          <Text>아동: {packageData.childPrice}원</Text>
          <Text>유아: {packageData.infantPrice}원</Text>
        </View>
        <View style={styles.scheduleContainer}>
          {packageData.schedule.map((day, index) => (
            <View key={index}>
              <Text style={styles.dayTitle}>{day.day}</Text>
              {day.activities.map((activity, idx) => (
                <Text key={idx}>{activity}</Text>
              ))}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
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
  safeArea: {
    flex: 1,
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
  loginText: {
    fontSize: 16,
  },
  headerBottom: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    width: 30,
  },
  reserveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  reserveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PackageDetail;