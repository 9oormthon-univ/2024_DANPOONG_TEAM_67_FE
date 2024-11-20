import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./screens/Home";
import Kakao from "./screens/Kakao";
import Nicname from "./screens/Nicname";
import Board from "./screens/board";
import Reservation from "./screens/Reservation"; // 추가

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
      <Stack.Screen name="board" component={Board} />
      <Stack.Screen name="Reservation" component={Reservation} /> // 추가
    </Stack.Navigator>
  );
};

export default Navigation;