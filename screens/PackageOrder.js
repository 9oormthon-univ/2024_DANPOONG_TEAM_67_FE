import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const PackageOrder = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState('1일차 점심 개별식사');

  const options = [
    '1일차 점심 개별식사',
    '1일차 저녁 개별식사',
    '기타 옵션1',
    '기타옵션2'
  ];

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
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
            <Text>{date.toLocaleDateString()}</Text>
            <Ionicons name="calendar" size={24} color="black" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
              minimumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>옵션 선택</Text>
          {options.map((option, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.optionItem}
              onPress={() => setSelectedOption(option)}
            >
              <View style={styles.checkbox}>
                {selectedOption === option && <View style={styles.checked} />}
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
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
          <Text style={styles.totalPrice}>1,000,000원</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.reserveButton}>
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
  optionItem: {
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
  checked: {
    width: 12,
    height: 12,
    backgroundColor: '#000',
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