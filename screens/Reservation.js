import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Platform, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import KakaoMap from './KakaoMap';

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

  const handleLocationSelect = (location) => {
    if (selectingDeparture) {
      setDeparture(location.address);
    } else {
      setDestination(location.address);
    }
    setShowMap(false);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleSearch = (text, isDeparture) => {
    if (text.length > 0) {
      setSelectingDeparture(isDeparture);
      setSearchKeyword(text);
      setShowMap(true);
    }
  };

  const handleBack = () => {
    setShowMap(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} onPress={() => navigation.goBack()} />
        <Text style={styles.logo}>솜길</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.login}>     </Text>
        </TouchableOpacity>
      </View>

      {showMap ? (
        <View style={styles.mapContainer}>
          <KakaoMap 
            onLocationSelect={handleLocationSelect}
            initialKeyword={searchKeyword}
            onBack={handleBack}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.locationContainer}>
            <View style={styles.searchContainer}>
              <TextInput 
                style={styles.locationInput}
                value={departure}
                onChangeText={setDeparture}
                placeholder="출발지 검색"
                returnKeyType="search"
                onSubmitEditing={() => handleSearch(departure, true)}
              />
              <TouchableOpacity 
                style={styles.searchButton}
                onPress={() => handleSearch(departure, true)}
              >
                <Ionicons name="search" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput 
                style={styles.locationInput}
                value={destination}
                onChangeText={setDestination}
                placeholder="도착지 검색"
                returnKeyType="search"
                onSubmitEditing={() => handleSearch(destination, false)}
              />
              <TouchableOpacity 
                style={styles.searchButton}
                onPress={() => handleSearch(destination, false)}
              >
                <Ionicons name="search" size={20} color="#666" />
              </TouchableOpacity>
            </View>
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
    paddingTop: Platform.OS === 'android' ? 40 : 0,
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
    height: 160,
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
    padding: 10,
    backgroundColor: '#e8f4fd',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  login: {
    fontSize: 16,
    color: '#000',
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
});

export default Reservation;