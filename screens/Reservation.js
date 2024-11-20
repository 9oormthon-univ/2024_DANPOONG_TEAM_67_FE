import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Platform, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const Reservation = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [people, setPeople] = useState('');
  const [request, setRequest] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [departure, setDeparture] = useState('판교역');
  const [destination, setDestination] = useState('카카오 AI 캠퍼스');

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const formatDate = (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const formatTime = (time) => {
    let hours = time.getHours();
    let minutes = time.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes}`;
  };

  const handleReservation = () => {
    setShowModal(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>솜길</Text>
          <TouchableOpacity>
            <Text style={styles.loginText}>로그인</Text>
          </TouchableOpacity>
        </View>

        {/* 검색 영역 */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <View style={styles.searchRow}>
              <View style={[styles.dot, { backgroundColor: 'red' }]} />
              <TouchableOpacity style={styles.searchInput}>
                <Text style={styles.searchText}>출발지 검색</Text>
              </TouchableOpacity>
              <Ionicons name="search" size={20} color="black" />
            </View>
            <View style={styles.searchRow}>
              <View style={[styles.dot, { backgroundColor: 'black' }]} />
              <TouchableOpacity style={styles.searchInput}>
                <Text style={styles.searchText}>도착지 검색</Text>
              </TouchableOpacity>
              <Ionicons name="search" size={20} color="black" />
            </View>
          </View>
        </View>

        {/* 예약 정보 입력 */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>날짜 선택</Text>
          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{formatDate(date)}</Text>
            <Ionicons name="calendar" size={20} color="black" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              style={styles.datePicker}
            />
          )}

          <Text style={styles.label}>시간 선택</Text>
          <TouchableOpacity 
            style={styles.timeInput}
            onPress={() => setShowTimePicker(true)}
          >
            <Text>{formatTime(time)}</Text>
            <Ionicons name="time-outline" size={20} color="black" />
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={onTimeChange}
            />
          )}

          <Text style={styles.label}>인원 선택</Text>
          <TextInput 
            style={styles.input}
            placeholder="명"
            value={people}
            onChangeText={setPeople}
          />

          <Text style={styles.label}>기타 요구사항</Text>
          <TextInput
            style={styles.requestInput}
            placeholder="From..."
            multiline
            value={request}
            onChangeText={setRequest}
          />

          <TouchableOpacity 
            style={styles.reserveButton}
            onPress={handleReservation}
          >
            <Text style={styles.reserveButtonText}>예약하기</Text>
          </TouchableOpacity>
        </View>

        {/* 확인 모달 추가 */}
        <Modal
          visible={showModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>출발지: {departure}</Text>
              <Text style={styles.modalText}>도착지: {destination}</Text>
              <Text style={styles.modalText}>시간: {formatTime(time)}</Text>
              <Text style={styles.modalText}>인원: {people}명</Text>
              {request ? <Text style={styles.modalText}>기타 요구사항: {request}</Text> : null}
              <Text style={styles.modalQuestion}>예약하시겠습니까?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalButton}
                  onPress={() => {
                    setShowModal(false);
                    Alert.alert('예약 완료', '예약이 완료되었습니다.');
                  }}
                >
                  <Text>확인</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalButton}
                  onPress={() => setShowModal(false)}
                >
                  <Text>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    backgroundColor: '#fff',
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#2196F3',
  },
  searchContainer: {
    padding: 15,
  },
  searchBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  searchText: {
    color: '#666',
  },
  formContainer: {
    padding: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
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
  input: {
    padding: 10,
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
});

export default Reservation;