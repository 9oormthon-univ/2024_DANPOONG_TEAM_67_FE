import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Alert 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PackageOrder = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // route.params의 기본값 설정
  const { packageId = 1, packageName = '숨길새발', price = 1000000 } = route.params || {};

  // 상태 관리
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [option1Selected, setOption1Selected] = useState(true);
  const [option2Selected, setOption2Selected] = useState(false);
  const [option3Selected, setOption3Selected] = useState(false);
  const [option4Selected, setOption4Selected] = useState(false);

  // 날짜 변경 핸들러
  const onChangeDate = (event, selected) => {
    setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // 예 가격 계산 함수 추가
  const calculateTotalPrice = () => {
    const basePrice = price || 1000000; // 기본 가격
    const adultPrice = basePrice * adultCount;
    const childPrice = Math.floor(basePrice * 0.7) * childCount; // 아동 30% 할인
    const infantPrice = 0; // 유아 무료

    // 옵션 가격 계산 (let으로 변경)
    let optionPrice = 0;
    
    // 각 옵션별 추가 가격 설정
    const option1Price = 0; // 1일차 점심 개별식사 가격
    const option2Price = 0; // 1일차 저녁 개별식사 가격
    const option3Price = 0; // 기타 옵션1 가격
    const option4Price = 0; // 기타 옵션2 가격

    // 선택된 옵션에 따라 가격 추가
    if (option1Selected) optionPrice += option1Price;
    if (option2Selected) optionPrice += option2Price;
    if (option3Selected) optionPrice += option3Price;
    if (option4Selected) optionPrice += option4Price;

    // 총 가격 반환
    return adultPrice + childPrice + infantPrice + optionPrice;
  };

  // 예약 처리
  const handleReservation = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      
      if (!userToken) {
        console.log('로그인 토큰 없음');
        Alert.alert('알림', '로그인이 필요한 서비스입니다.');
        return;
      }

      // 날짜 형식을 YYYY-MM-DD로 변경
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // 서버에 보낼 데이터 형식 맞추기
      const reservationData = {
        packageId: parseInt(packageId),
        adultCount: parseInt(adultCount),
        childCount: parseInt(childCount),
        infantCount: parseInt(infantCount),
        reservationDate: formatDate(selectedDate),
        totalPrice: Math.floor(calculateTotalPrice()) // 소수점 제거
      };

      // 디버깅을 위한 상세 로그
      console.log('=== 예약 요청 디버그 정보 ===');
      console.log('packageId:', packageId, typeof packageId);
      console.log('adultCount:', adultCount, typeof adultCount);
      console.log('childCount:', childCount, typeof childCount);
      console.log('infantCount:', infantCount, typeof infantCount);
      console.log('reservationDate:', formatDate(selectedDate));
      console.log('totalPrice:', calculateTotalPrice());
      console.log('요청 데이터:', JSON.stringify(reservationData, null, 2));
      console.log('Authorization 토큰:', userToken);

      // 먼저 가격 계산 요청
      const approvalResponse = await fetch('http://3.107.189.243:8080/api/reservation/approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(reservationData)
      });

      console.log('=== 서버 응답 정보 ===');
      console.log('응답 상태 코드:', approvalResponse.status);
      const responseText = await approvalResponse.text();
      console.log('응답 데이터:', responseText);

      if (!approvalResponse.ok) {
        throw new Error(`가격 계산 실패 - 상태 코드: ${approvalResponse.status}, 응답: ${responseText}`);
      }

      // 가격 계산이 성공하면 예약 생성 요청
      const createResponse = await fetch('http://3.107.189.243:8080/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(reservationData)
      });

      if (createResponse.ok) {
        Alert.alert(
          '예약 완료', 
          '패키지 예약이 완료되었습니다.',
          [
            {
              text: '예약 내역 보기',
              onPress: () => navigation.navigate('ReservationList')
            },
            {
              text: '확인',
              onPress: () => navigation.navigate('Home')
            }
          ]
        );
      } else {
        const errorText = await createResponse.text();
        throw new Error(`예약 생성 실패 - 상태 코드: ${createResponse.status}, 응답: ${errorText}`);
      }
    } catch (error) {
      console.error('=== 예약 에러 상세 ===');
      console.error('에러 메시지:', error.message);
      console.error('에러 스택:', error.stack);
      Alert.alert('오류', '예약 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>패키지 예약</Text>
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.packageTitle}>패키지 : 제주의 보석</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>날짜 선택</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{selectedDate.toLocaleDateString()}</Text>
            <Ionicons name="calendar" size={24} color="#4CAF50" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onChangeDate}
              minimumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>옵션 선택</Text>
          <View style={styles.optionContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, option1Selected && styles.checkboxChecked]}
              onPress={() => setOption1Selected(!option1Selected)}
            >
              {option1Selected && <Ionicons name="checkmark" size={16} color="white" />}
            </TouchableOpacity>
            <Text style={styles.optionText}>1일차 점심 개별식사</Text>
          </View>

          <View style={styles.optionContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, option2Selected && styles.checkboxChecked]}
              onPress={() => setOption2Selected(!option2Selected)}
            >
              {option2Selected && <Ionicons name="checkmark" size={16} color="white" />}
            </TouchableOpacity>
            <Text style={styles.optionText}>1일차 저녁 개별식사</Text>
          </View>

          <View style={styles.optionContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, option3Selected && styles.checkboxChecked]}
              onPress={() => setOption3Selected(!option3Selected)}
            >
              {option3Selected && <Ionicons name="checkmark" size={16} color="white" />}
            </TouchableOpacity>
            <Text style={styles.optionText}>기타 옵션1</Text>
          </View>

          <View style={styles.optionContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, option4Selected && styles.checkboxChecked]}
              onPress={() => setOption4Selected(!option4Selected)}
            >
              {option4Selected && <Ionicons name="checkmark" size={16} color="white" />}
            </TouchableOpacity>
            <Text style={styles.optionText}>기타옵션2</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>인원 선택</Text>
          <View style={styles.personCountContainer}>
            <Text>성인</Text>
            <View style={styles.counterInput}>
              <TextInput
                style={styles.input}
                value={adultCount.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text) || 0;
                  setAdultCount(num);
                }}
                keyboardType="number-pad"
              />
              <Text>명</Text>
            </View>
          </View>

          <View style={styles.personCountContainer}>
            <Text>아동</Text>
            <View style={styles.counterInput}>
              <TextInput
                style={styles.input}
                value={childCount.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text) || 0;
                  setChildCount(num);
                }}
                keyboardType="number-pad"
              />
              <Text>명</Text>
            </View>
          </View>

          <View style={styles.personCountContainer}>
            <Text>유아</Text>
            <View style={styles.counterInput}>
              <TextInput
                style={styles.input}
                value={infantCount.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text) || 0;
                  setInfantCount(num);
                }}
                keyboardType="number-pad"
              />
              <Text>명</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>총 가격</Text>
          <Text style={styles.totalPrice}>{calculateTotalPrice().toLocaleString()}원</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.reserveButton} onPress={handleReservation}>
        <Text style={styles.reserveButtonText}>예약하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  optionText: {
    fontSize: 16,
  },
  personCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  counterInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
    minWidth: 80,
    justifyContent: 'center',
  },
  input: {
    width: 50,
    textAlign: 'center',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  reserveButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    alignItems: 'center',
    margin: 20,
    borderRadius: 10,
  },
  reserveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PackageOrder;