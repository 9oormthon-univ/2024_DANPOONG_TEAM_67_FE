import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import WebView from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';

const KakaoMap = ({ onLocationSelect, initialKeyword, onBack }) => {
  const webViewRef = useRef(null);

  useEffect(() => {
    if (initialKeyword && webViewRef.current) {
      const searchScript = `
        if (ps) {
          ps.keywordSearch("${initialKeyword}", function(data, status) {
            if (status === kakao.maps.services.Status.OK) {
              console.log("검색 성공");
              var place = data[0];
              var moveLatLng = new kakao.maps.LatLng(place.y, place.x);
              
              // 지도 중심 이동
              map.setCenter(moveLatLng);
              
              // 마커 이동
              marker.setPosition(moveLatLng);
              marker.setMap(map);
              
              // 주소 표시
              document.getElementById('address').innerText = place.address_name || place.road_address_name;
            } else {
              console.log("검색 실패");
            }
          });
        }
        true;
      `;
      
      setTimeout(() => {
        webViewRef.current.injectJavaScript(searchScript);
      }, 1000);
    }
  }, [initialKeyword]);

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      onLocationSelect(data);
    } catch (error) {
      console.error('Message parsing error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      
      <WebView
        ref={webViewRef}
        source={{ 
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=d22e76c8a0d0680b90fc8d5b7dd624cf&libraries=services"></script>
                <style>
                  body { margin: 0; padding: 0; }
                  #map { width: 100%; height: 100vh; }
                  #address { 
                    position: fixed;
                    bottom: 60px;
                    left: 0;
                    right: 0;
                    background: white;
                    padding: 15px;
                    text-align: center;
                  }
                </style>
              </head>
              <body>
                <div id="map"></div>
                <div id="address"></div>
                <script>
                  var mapContainer = document.getElementById('map');
                  var mapOption = {
                    center: new kakao.maps.LatLng(37.5665, 126.9780),
                    level: 3
                  };

                  var map = new kakao.maps.Map(mapContainer, mapOption);
                  var marker = new kakao.maps.Marker();
                  var geocoder = new kakao.maps.services.Geocoder();
                  var ps = new kakao.maps.services.Places();

                  // 마커 클릭 이벤트
                  kakao.maps.event.addListener(marker, 'click', function() {
                    var position = marker.getPosition();
                    geocoder.coord2Address(position.getLng(), position.getLat(), function(result, status) {
                      if (status === kakao.maps.services.Status.OK) {
                        var address = result[0].address.address_name;
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          latitude: position.getLat(),
                          longitude: position.getLng(),
                          address: address
                        }));
                      }
                    });
                  });

                  // 지도 클릭 이벤트
                  kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
                    var latlng = mouseEvent.latLng;
                    marker.setPosition(latlng);
                    marker.setMap(map);
                    
                    geocoder.coord2Address(latlng.getLng(), latlng.getLat(), function(result, status) {
                      if (status === kakao.maps.services.Status.OK) {
                        var address = result[0].address.address_name;
                        document.getElementById('address').innerText = address;
                      }
                    });
                  });
                </script>
              </body>
            </html>
          `
        }}
        style={styles.map}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        geolocationEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1000,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});

export default KakaoMap;