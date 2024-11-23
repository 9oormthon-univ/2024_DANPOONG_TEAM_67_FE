import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ReservationList = () => {
  const navigation = useNavigation();
  const [reservations, setReservations] = useState([]);

  // API로부터 예약 내역을 가져오는 함수
  // 실제 API 연동 시 사용할 함수
  const fetchReservations = async () => {
    try {
      // const response = await fetch('YOUR_API_ENDPOINT');
      // const data = await response.json();
      // setReservations(data);

      // 임시 더미 데이터
      const dummyData = [
        {
          id: 1,
          packageName: '제주의 보석',
          period: '2024.11.23-2024.11.24',
          details: '성인 1인,유아2인,아동3인',
          price: '1,000,000원',
          status: '예약중',
          // image: require('../assets/jeju.jpg')
        },
        {
          id: 2,
          packageName: '속초의 크리스마스',
          period: '2024.12.25-2024.12.26',
          details: '성인 2인,유아1인',
          price: '5,000,000원',
          status: '예약완료',
          // image: require('../assets/sokcho.jpg')
        },
      ];
      setReservations(dummyData);
    } catch (error) {
      console.error('예약 내역 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

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
        {reservations.map((reservation) => (
          <View key={reservation.id} style={styles.reservationCard}>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.packageName}>{reservation.packageName}</Text>
                <Text 
                  style={[
                    styles.status,
                    { color: getStatusColor(reservation.status) }
                  ]}
                >
                  {reservation.status}
                </Text>
              </View>
              <Text style={styles.period}>{reservation.period}</Text>
              <Text style={styles.details}>{reservation.details}</Text>
              <Text style={styles.price}>{reservation.price}</Text>
            </View>
          </View>
        ))}
        {reservations.length === 0 && (
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
});

export default ReservationList;