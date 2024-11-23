import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const WriteReview = () => {
  const navigation = useNavigation();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (review.trim().length < 10) {
      Alert.alert('알림', '리뷰를 10자 이상 작성해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const currentDate = new Date().toISOString().split('T')[0];
      
      const reviewData = {
        title: "여행 패키지 리뷰",
        content: review,
        rating: rating,
        date: currentDate,
        image: "패키지_이미지_URL",
        location: "출발지",
        destination: "도착지"
      };

      console.log('전송하는 데이터:', reviewData);
      console.log('토큰:', userToken);

      const response = await fetch('http://3.107.189.243:8080/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify(reviewData),
      });

      const responseData = await response.json();
      console.log('서버 응답:', response.status, responseData);

      if (response.ok) {
        Alert.alert(
          '성공', 
          '후기가 등록되었습니다!',
          [
            {
              text: '확인',
              onPress: () => navigation.navigate('MyReview')
            }
          ]
        );
      } else {
        throw new Error(`리뷰 등록 실패: ${JSON.stringify(responseData)}`);
      }
    } catch (error) {
      console.error('리뷰 제출 에러 상세:', error);
      Alert.alert('오류', `리뷰 등록 중 문제가 발생했습니다. ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
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
    );
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
        <TouchableOpacity onPress={() => navigation.navigate('MyPage')}>
        <Ionicons name="person-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.headerBottom}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.content}>
          <Text style={styles.ratingText}>만족도를 입력해주세요!</Text>
          {renderStars()}
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="이곳에 리뷰를 작성해주세요."
              multiline
              numberOfLines={4}
              value={review}
              onChangeText={setReview}
            />
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmitReview}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>등록</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: Platform.OS === 'android' ? 30 : 0,
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
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  ratingText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    height: 150,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WriteReview;