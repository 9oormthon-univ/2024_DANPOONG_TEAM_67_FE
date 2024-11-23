import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const ReservationList = () => {
  const navigation = useNavigation();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // API로부터 예약 내역을 가져오는 함수
  const fetchReservations = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        Alert.alert('알림', '로그인이 필요한 서비스입니다.');
        navigation.navigate('Kakao');
        return;
      }

      const response = await fetch('http://3.107.189.243:8080/api/reservation/list', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      } else {
        throw new Error('예약 내역을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('예약 내역 조회 실패:', error);
      Alert.alert('오류', '예약 내역을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // 화면이 포커스될 때마다 예약 내역 새로고침
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchReservations();
    });

    return unsubscribe;
  }, [navigation]);

  const getStatusColor = (status) => {
    switch (status) {
      case '예약중':
        return '#FFA500';
      case '예약완료':
        return '#4CAF50';
      case '리뷰작성':
        return '#2196F3';
      default:
        return '#000000';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo}
          />
          <Text style={styles.headerTitle}>솜길</Text>
        </View>
        <TouchableOpacity 
          onPress={() => navigation.navigate('MyPage')}
          style={styles.loginButton}
        >
          <Ionicons 
            name="person-circle-outline" 
            size={28} 
            color="black"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <ScrollView style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        ) : reservations.length > 0 ? (
          reservations.map((reservation) => (
            <View key={reservation.id} style={styles.reservationCard}>
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.packageName}>{reservation.packageName}</Text>
                  <Text style={[styles.status, { color: getStatusColor(reservation.status) }]}>
                    {reservation.status}
                  </Text>
                </View>
                <Text style={styles.period}>
                  {reservation.reservationDate}
                </Text>
                <Text style={styles.details}>
                  {`성인 ${reservation.adultCount}인, 아동 ${reservation.childCount}인, 유아 ${reservation.infantCount}인`}
                </Text>
                <Text style={styles.price}>
                  {`${reservation.totalPrice.toLocaleString()}원`}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>예약 내역이 없습니다.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 35,
    backgroundColor: '#fff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  backButton: {
    padding: 15,
  },
  loginButton: {
    padding: 5,
  },
  container: {
    flex: 1,
    padding: 15,
  },
  reservationCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  packageImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  packageName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  period: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  price: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReservationList;