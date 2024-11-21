import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./screens/Home";
import Kakao from "./screens/Kakao";
import Nicname from "./screens/Nicname";
import Board from "./screens/board";
import Reservation from "./screens/Reservation";
import MyPage from "./screens/MyPage";
import PackageDetail from './screens/PackageDetail';
import Package1 from './screens/Package1';
import PackageOrder from './screens/PackageOrder';
import ReservationList from './screens/ReservationList';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"    
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Kakao" component={Kakao} />
      <Stack.Screen name="Nicname" component={Nicname} />
      <Stack.Screen name="Board" component={Board} />
      <Stack.Screen name="Reservation" component={Reservation} />
      <Stack.Screen name="MyPage" component={MyPage} />
      <Stack.Screen name="Detail" component={PackageDetail} />
      <Stack.Screen name="Package1" component={Package1} />
      <Stack.Screen name="PackageOrder" component={PackageOrder} />
      <Stack.Screen name="ReservationList" component={ReservationList} />
    </Stack.Navigator>
  );
};

export default Navigation;