import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./screens/Home";
import Kakao from "./screens/Kakao";
import Nicname from "./screens/Nicname";
import Board from "./screens/board";
import Reservation from "./screens/Reservation";
import Package1 from "./screens/package1"; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
        <Stack.Screen name="Package1" component={Package1} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}