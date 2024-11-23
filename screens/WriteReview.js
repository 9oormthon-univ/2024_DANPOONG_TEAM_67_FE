import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const WriteReview = () => {
  const navigation = useNavigation();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [reservationData, setReservationData] = useState(null);

  // 예약 정보 조회
  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const response = await fetch('http://3.107.189.243:8080/api/review/reservation', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`,
          }
        });

        if (!response.ok) {
          throw new Error('예약 데이터를 가져오는데 실패했습니다.');
        }

        const data = await response.json();
        setReservationData(data);
      } catch (error) {
        console.error('예약 데이터 조회 에러:', error);
        Alert.alert('오류', '예약 정보를 불러오는데 실패했습니다.');
      }
    };

    fetchReservationData();
  }, []);

  const handleSubmitReview = async () => {
    if (!review.trim()) {
      Alert.alert('알림', '리뷰 내용을 입력해주세요.');
      return;
    }

    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const reviewData = {
        reservationId: reservationData?.reservationId,
        content: review,
        rating: rating
      };

      const response = await fetch('http://3.107.189.243:8080/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        Alert.alert('성공', '리뷰가 등록되었습니다.', [
          { text: '확인', onPress: () => navigation.goBack() }
        ]);
      } else {
        throw new Error('리뷰 등록에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '리뷰 등록 중 문제가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* 예약 정보 */}
        <View style={styles.reservationInfo}>
          <Text style={styles.packageName}>{reservationData?.packageName || '제주의보석'}</Text>
          <Text style={styles.reservationDate}>{reservationData?.reservationDate || '2024.12.26'}</Text>
          <Text style={styles.details}>
            {reservationData?.details || '성인3, 아동2, 유아1'}
          </Text>
        </View>

        {/* 별점 */}
        <Text style={styles.ratingTitle}>만족도를 입력해주세요!</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
            >
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={30}
                color="#FFD700"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* 리뷰 입력 */}
        <View style={styles.reviewContainer}>
          <Text style={styles.reviewTitle}>어떤점이 마음에 드셨나요?</Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="이곳에 리뷰를 작성해주세요."
            multiline
            value={review}
            onChangeText={setReview}
          />
        </View>

        {/* 등록 버튼 */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmitReview}
        >
          <Text style={styles.submitButtonText}>등록</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    marginBottom: 20,
  },
  reservationInfo: {
    marginBottom: 30,
  },
  packageName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reservationDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  details: {
    fontSize: 16,
    color: '#666',
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 15,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  reviewContainer: {
    marginBottom: 30,
  },
  reviewTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    height: 150,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WriteReview;