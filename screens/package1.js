import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const data = [
  { id: '1', title: '제주의 보석', image: require('../assets/icon.png'), reviews: 384 },
  { id: '2', title: '송도의 크리스마스', image: require('../assets/icon.png'), reviews: 223 },
  { id: '3', title: '인천 트래킹', image: require('../assets/icon.png'), reviews: 25 },
  { id: '4', title: '강화도 루지 마스터', image: require('../assets/icon.png'), reviews: 87 },
];

const Package1 = () => {
  const navigation = useNavigation();

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.logoText}>솜길</Text>
      <View style={styles.emptySpace} />
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('Detail', { itemId: item.id })}
    >
      <Image source={item.image} style={styles.image} />
      <View style={styles.cardContent}>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>★★★★★</Text>
          <Text style={styles.reviewCount}>({item.reviews})</Text>
        </View>
        <View style={styles.reviewContainer}>
          <Text style={styles.reviewText}>리뷰 {item.reviews}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <Text style={styles.pageTitle}>숨겨진 명소 코스</Text>
      <FlatList
        key={'two-column'}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    width: 30,
  },
  logoText: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptySpace: {
    width: 30,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 15,
  },
  list: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  cardContent: {
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#FFD700',
    fontSize: 14,
    marginRight: 3,
  },
  reviewCount: {
    color: '#666',
    fontSize: 14,
  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 3,
  },
});

export default Package1;