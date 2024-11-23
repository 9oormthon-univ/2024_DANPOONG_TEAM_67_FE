import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Image,
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

function Search() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>솜길</Text>
      </View>

      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="검색어를 입력하시오"
            placeholderTextColor="#999"
            returnKeyType="search"
          />
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <TouchableOpacity 
          style={styles.resultContainer}
          onPress={() => navigation.navigate('Detail', { itemId: 1 })}
        >
          <View style={[styles.resultImage, styles.imagePlaceholder]}>
            <Ionicons name="image-outline" size={40} color="#666" />
          </View>
          <View style={styles.resultInfo}>
            <Text style={styles.locationText}>제주특별자치도</Text>
            <Text style={styles.titleText}>제주의 보석</Text>
            <Text style={styles.priceText}>180,000₩</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>5.0</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: Platform.OS === 'android' ? 40 : 15,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 15,
    borderRadius: 25,
  },
  backButton: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 5,
  },
  container: {
    flex: 1,
    padding: 15,
  },
  resultContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 20,
  },
  resultImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  resultInfo: {
    flex: 1,
    padding: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  imagePlaceholder: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Search;
