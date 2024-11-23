import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get('http://3.107.189.243:8080/api/reviews', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReviews(response.data);
    } catch (error) {
      console.error('리뷰 불러오기 실패:', error);
    }
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.reviewImage}
        />
        <View style={styles.reviewInfo}>
          <Text style={styles.reviewTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text key={star} style={styles.star}>
                {star <= item.rating ? '★' : '☆'}
              </Text>
            ))}
          </View>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
      <View style={styles.tagContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>장소: {item.location}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>도착지: {item.destination}</Text>
        </View>
      </View>
      <Text style={styles.content}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>작성한 리뷰</Text>
      <FlatList
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
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
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
  },
  listContainer: {
    padding: 16,
  },
  reviewCard: {
    backgroundColor: '#f5f7f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  reviewInfo: {
    marginLeft: 12,
    flex: 1,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  star: {
    color: '#FFD700',
    marginRight: 2,
  },
  date: {
    color: '#666',
    fontSize: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#e8f0e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#4a4a4a',
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});

export default MyReviews;