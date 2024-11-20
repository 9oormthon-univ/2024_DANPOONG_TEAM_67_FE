// HiddenGems.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const data = [
  { id: '1', title: '제주의 보석', image: require('../assets/icon.png'), reviews: 384 },
  { id: '2', title: '송도의 크리스마스', image: require('../assets/icon.png'), reviews: 223 },
  { id: '3', title: '인천 트래킹', image: require('../assets/icon.png'), reviews: 25 },
  { id: '4', title: '강화도 루지 마스터', image: require('../assets/icon.png'), reviews: 87 },
];

const HiddenGems = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detail', { itemId: item.id })}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.reviews}>리뷰 {item.reviews}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>숨겨진 명소 코스</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: 10,
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f8ff',
  },
  image: {
    width: '100%',
    height: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  reviews: {
    fontSize: 14,
    color: '#555',
    padding: 10,
  },
});

export default HiddenGems;