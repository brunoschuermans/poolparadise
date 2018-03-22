import React from 'react';
import {StackNavigator} from "react-navigation";
import Home from "./Home";
import Guests from "./Guests";
import Categories from "./Categories";
import BarCode from "./BarCode";
import Bar from "./Bar";

const AppNavigator = StackNavigator({
    Home: { screen: Home },
    Guests: { screen: Guests},
    Categories: { screen: Categories},
    BarCode: { screen: BarCode},
    Bar: { screen: Bar},
}, {
    initialRouteName : "Home",
    headerMode: 'none',
});

export default AppNavigator;