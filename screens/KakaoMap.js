import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import WebView from 'react-native-webview';

const KakaoMap = ({ onLocationSelect }) => {
  const [html, setHtml] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const mapHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=d22e76c8a0d0680b90fc8d5b7dd624cf&libraries=services"></script>
          <style>
            .map_wrap {position:relative;width:100%;height:100vh;}
            #map {width:100%;height:100vh;}
            #btnMyLocation {position:absolute;bottom:30px;right:10px;width:36px;height:36px;z-index:1;background-color:#fff;border:1px solid #bbb;border-radius:5px;text-align:center;line-height:36px;cursor:pointer;}
          </style>
        </head>
        <body>
          <div class="map_wrap">
            <div id="map"></div>
            <div id="btnMyLocation" onclick="getCurrentLocation()">◎</div>
          </div>

          <script>
            var mapContainer = document.getElementById('map');
            var mapOption = {
              center: new kakao.maps.LatLng(33.450701, 126.570667),
              level: 3
            };
            var map = new kakao.maps.Map(mapContainer, mapOption);
            var geocoder = new kakao.maps.services.Geocoder();

            function getCurrentLocation() {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                  var lat = position.coords.latitude;
                  var lon = position.coords.longitude;
                  var locPosition = new kakao.maps.LatLng(lat, lon);
                  map.setCenter(locPosition);
                  geocoder.coord2Address(lon, lat, function(result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                      var address = result[0].address.address_name;
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        latitude: lat,
                        longitude: lon,
                        address: address
                      }));
                    }
                  });
                });
              }
            }

            kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
              var latlng = mouseEvent.latLng;
              geocoder.coord2Address(latlng.getLng(), latlng.getLat(), function(result, status) {
                if (status === kakao.maps.services.Status.OK) {
                  var address = result[0].address.address_name;
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    latitude: latlng.getLat(),
                    longitude: latlng.getLng(),
                    address: address
                  }));
                }
              });
            });

            getCurrentLocation();
          </script>
        </body>
      </html>
    `;
    setHtml(mapHtml);
  }, []);

  const handleMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    setSelectedLocation(data);
    if (onLocationSelect) {
      onLocationSelect(data);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        style={styles.map}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        geolocationEnabled={true}
      />
      {selectedLocation && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{selectedLocation.address}</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>도착지로 설정</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  infoBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default KakaoMap;