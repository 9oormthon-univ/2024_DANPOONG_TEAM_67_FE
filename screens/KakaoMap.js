import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert, FlatList } from 'react-native';
import { WebView } from 'react-native-webview';
import useLocation from '../screens/useLocation';
import Ionicons from 'react-native-vector-icons/Ionicons';

// API 키 상수 정의
const KAKAO_MAP_KEY = 'd22e76c8a0d0680b90fc8d5b7dd624cf'; // 여기에 JavaScript 키 입력
const KAKAO_REST_KEY = '9a65039b05d81166bcf8df1dc82404c9'; // 여기에 REST API 키 입력

const KakaoMap = ({ initialKeyword, onLocationSelect, onBack }) => {
  const webViewRef = React.useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    if (isMapReady && initialKeyword?.y && initialKeyword?.x) {
      console.log('Setting selected place:', initialKeyword);
      setSelectedPlace(initialKeyword);
      const moveScript = `
        map.setCenter(new kakao.maps.LatLng(${initialKeyword.y}, ${initialKeyword.x}));
        map.setLevel(3);
        
        new kakao.maps.Marker({
          position: new kakao.maps.LatLng(${initialKeyword.y}, ${initialKeyword.x}),
          map: map
        });
        
        true;
      `;
      webViewRef.current?.injectJavaScript(moveScript);
    }
  }, [isMapReady, initialKeyword]);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}"></script>
      </head>
      <body>
        <div id="map" style="width:100%;height:100vh;"></div>
        <script>
          let map;
          kakao.maps.load(() => {
            map = new kakao.maps.Map(document.getElementById('map'), {
              center: new kakao.maps.LatLng(37.566826, 126.9786567),
              level: 3
            });
            window.ReactNativeWebView.postMessage('mapReady');
          });
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event) => {
    if (event.nativeEvent.data === 'mapReady') {
      setIsMapReady(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>위치 검색</Text>
      </View>
      
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        onMessage={handleMessage}
      />

      {selectedPlace && (
        <View style={styles.bottomSheet}>
          <View style={styles.placeInfo}>
            <Text style={styles.placeName}>{selectedPlace.place_name}</Text>
            <Text style={styles.placeAddress}>{selectedPlace.address_name}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.setButton}
              onPress={() => onLocationSelect(selectedPlace, true)}
            >
              <Text style={styles.buttonText}>출발지로 설정</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.setButton}
              onPress={() => onLocationSelect(selectedPlace, false)}
            >
              <Text style={styles.buttonText}>도착지로 설정</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  mapContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  resultContainer: {
    maxHeight: 200,
    backgroundColor: 'white',
  },
  resultList: {
    padding: 10,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  placeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressName: {
    fontSize: 14,
    color: '#666',
  },
  phone: {
    fontSize: 14,
    color: '#999',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  placeInfo: {
    marginBottom: 16,
  },
  placeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  setButton: {
    flex: 1,
    backgroundColor: '#4B89DC',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default KakaoMap;