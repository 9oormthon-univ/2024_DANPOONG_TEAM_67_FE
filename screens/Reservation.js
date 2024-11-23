import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Platform, Modal, Alert, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import KakaoMap from './KakaoMap';

// API 키 상수 정의
const KAKAO_REST_KEY = '9a65039b05d81166bcf8df1dc82404c9'; // REST API 키 입력

const formatTime = (time) => {
  let hours = time.getHours();
  let minutes = time.getMinutes();
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes}`;
};

const Reservation = () => {
  const navigation = useNavigation();
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectingDeparture, setSelectingDeparture] = useState(true);
  const [people, setPeople] = useState('');
  const [request, setRequest] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleReservation = () => {
    if (!departure || !destination || !people) {
      Alert.alert(
        '입력 오류',
        '출발지, 도착지, 인원은 필수 입력 항목입니다.',
        [{ text: '확인' }]
      );
      return;
    }

    const reservationInfo = 
      `출발지: ${departure}\n` +
      `도착지: ${destination}\n` +
      `시간: ${formatTime(selectedTime)}\n` +
      `인원: ${people}명\n` +
      (request ? `기타 요구사항: ${request}` : '');

    Alert.alert(
      '예약 정보 확인',
      reservationInfo,
      [
        {
          text: '확인',
          onPress: () => {
            Alert.alert('예약 완료', '예약이 완료되었습니다.');
          }
        },
        {
          text: '취소',
          style: 'cancel'
        }
      ]
    );
  };

  const handleLocationSelect = (place, isDeparture) => {
    if (isDeparture) {
      setDeparture(place.place_name);
    } else {
      setDestination(place.place_name);
    }
    setShowMap(false);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const searchPlaces = async (text, isDeparture) => {
    if (!text.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(text)}`,
        {
          headers: {
            Authorization: `KakaoAK ${KAKAO_REST_KEY}`
          }
        }
      );

      const data = await response.json();
      if (data.documents) {
        setSearchResults(data.documents);
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('오류', '검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (text, isDeparture) => {
    if (isDeparture) {
      setDeparture(text);
    } else {
      setDestination(text);
    }
    searchPlaces(text, isDeparture);
  };

  const handlePlaceSelect = (place, isDeparture) => {
    if (isDeparture) {
      setDeparture(place.place_name);
    } else {
      setDestination(place.place_name);
    }
    setSearchResults([]);
    
    setSearchKeyword({
      place_name: place.place_name,
      address_name: place.address_name,
      y: parseFloat(place.y),
      x: parseFloat(place.x)
    });
    
    setSelectingDeparture(isDeparture);
    setShowMap(true);
  };

  const handleBack = () => {
    setShowMap(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerLeft}
          onPress={() => {
            console.log('홈으로 이동 시도');  // 디버깅용
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          }}
        >
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo}
          />
          <Text style={styles.headerTitle}>솜길</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate('MyPage')}
        >
          <Ionicons name="person-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {showMap ? (
        <View style={styles.mapContainer}>
          <KakaoMap 
            initialKeyword={searchKeyword}
            onLocationSelect={handleLocationSelect}
            onBack={() => setShowMap(false)}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.locationContainer}>
            <View style={styles.searchContainer}>
              <TextInput 
                style={styles.locationInput}
                value={departure}
                onChangeText={text => handleSearchChange(text, true)}
                placeholder="출발지 검색"
              />
              <TouchableOpacity 
                style={styles.searchButton}
                onPress={() => handleSearch(departure, true)}
              >
                <Ionicons name="search" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {searchResults.length > 0 && (
              <View style={styles.searchResultsContainer}>
                <ScrollView style={styles.resultsList}>
                  {searchResults.map((place) => (
                    <TouchableOpacity
                      key={place.id}
                      style={styles.resultItem}
                      onPress={() => handlePlaceSelect(place, selectingDeparture)}
                    >
                      <Text style={styles.placeName}>{place.place_name}</Text>
                      <Text style={styles.addressName}>{place.address_name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.searchContainer}>
              <TextInput 
                style={styles.locationInput}
                value={destination}
                onChangeText={(text) => handleSearchChange(text, false)}
                placeholder="도착지 검색"
                returnKeyType="search"
              />
              <TouchableOpacity 
                style={styles.searchButton}
                onPress={() => searchPlaces(destination, false)}
              >
                <Ionicons name="search" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {destination.length > 0 && searchResults.length > 0 && (
              <View style={styles.searchResultsContainer}>
                {searchResults.map((place) => (
                  <TouchableOpacity
                    key={place.id}
                    style={styles.resultItem}
                    onPress={() => handlePlaceSelect(place, false)}
                  >
                    <Text style={styles.placeName}>{place.place_name}</Text>
                    <Text style={styles.addressName}>{place.address_name}</Text>
                    <Text style={styles.distance}>
                      {(place.distance / 1000).toFixed(2)}km
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Text style={styles.label}>날짜 선택</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
            <Ionicons name="calendar" size={24} color="black" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}

          <Text style={styles.label}>시간 선택</Text>
          <TouchableOpacity 
            style={styles.timeInput}
            onPress={() => setShowTimePicker(true)}
          >
            <Text>{formatTime(selectedTime)}</Text>
            <Ionicons name="time-outline" size={20} color="black" />
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={(event, time) => {
                setShowTimePicker(false);
                if (time) setSelectedTime(time);
              }}
            />
          )}

          <Text style={styles.label}>인원 선택</Text>
          <TextInput 
            style={styles.input}
            value={people}
            onChangeText={setPeople}
            placeholder="명"
            keyboardType="number-pad"
          />

          <Text style={styles.label}>기타 요청사항</Text>
          <TextInput
            style={styles.requestInput}
            value={request}
            onChangeText={setRequest}
            placeholder="기타 요구사항을 입력하세요"
            multiline
          />

          <TouchableOpacity 
            style={styles.reserveButton}
            onPress={handleReservation}
          >
            <Text style={styles.reserveButtonText}>예약하기</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f0f8ff',
  },
  timeInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  peopleInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  requestInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    height: 150,
    marginBottom: 20,
  },
  reserveButton: {
    backgroundColor: '#e8f4fd',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#000',
  },
  datePicker: {
    backgroundColor: 'white',
    width: '100%',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    padding: 10,
    width: 100,
    alignItems: 'center',
    backgroundColor: '#e8f4fd',
    borderRadius: 5,
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    marginRight: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 25
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,  // 터치 영역 확보
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  backButton: {
    position: 'absolute',
    top: 100,  // 위치 조정
    left: 8,
    padding: 10,
    zIndex: 1,  
  },
  locationContainer: {
    flexDirection: 'column',
    marginBottom: 15,
  },
  locationInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: '#f0f8ff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchButton: {
    position: 'absolute',
    right: 15,
    height: 50,
    justifyContent: 'center',
  },
  searchResultsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
    maxHeight: 200,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  placeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  addressName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  distance: {
    fontSize: 12,
    color: '#999',
  },
  resultsList: {
    flex: 1,
  },
});

export default Reservation;