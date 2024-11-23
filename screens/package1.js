import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Package1 = ({ route }) => {
  const navigation = useNavigation();
  const { packageType, packageTitle, packageList } = route.params;
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Home에서 전달받은 packageList를 바로 사용하도록 수정
  useEffect(() => {
    if (packageList) {
      setPackages(packageList);
      setLoading(false);
    }
  }, [packageList]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{packageTitle}</Text>
      </View>

      <View style={styles.packagesContainer}>
        {loading ? (
          <Text style={styles.loadingText}>로딩 중...</Text>
        ) : packages.length > 0 ? (
          packages.map((pkg, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.packageCard}
              onPress={() => navigation.navigate('Detail', { 
                packageId: pkg.id,
                packageData: pkg 
              })}
            >
              <Text style={styles.packageTitle}>{pkg.name}</Text>
              <Text style={styles.packageDescription}>{pkg.description}</Text>
              <View style={styles.packageInfo}>
                <Text style={styles.packagePrice}>
                  ₩{pkg.price?.toLocaleString() || '가격 정보 없음'}
                </Text>
                <Text style={styles.reviewInfo}>
                  평점: {pkg.reviewRating || 0} ({pkg.reviewNumber || 0}개의 리뷰)
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}>
            {packageTitle}에 해당하는 패키지가 없습니다.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  packagesContainer: {
    padding: 15,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  packageCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  packageDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  packageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  reviewInfo: {
    fontSize: 14,
    color: '#666',
  }
});

export default Package1;