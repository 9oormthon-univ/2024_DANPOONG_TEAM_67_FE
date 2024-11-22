import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function useLocation() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // 위치 권한 요청
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          console.log('위치 권한이 거부되었습니다');
          // 기본 위치 설정 (예: 서울)
          setLocation({
            latitude: 37.483034,
            longitude: 126.902435,
          });
          return;
        }

        // 현재 위치 가져오기
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      } catch (error) {
        console.log('위치 가져오기 실패:', error);
        // 에러 시 기본 위치 설정
        setLocation({
          latitude: 37.483034,
          longitude: 126.902435,
        });
      }
    })();
  }, []);

  return location;
}