import React from 'react';
import {StackNavigator} from "react-navigation";
import Home from "./Home";
import Categories from "./Categories";
import BarCode from "./BarCode";
import Bar from "./Bar";
import Kitchen from "./Kitchen";
import Reception from "./Reception";
import ScanGuest from "./ScanGuest";
import ScanItem from "./ScanItem";

const AppNavigator = StackNavigator({
    Home: { screen: Home },
    ScanGuest: { screen: ScanGuest},
    ScanItem: { screen: ScanItem},
    Categories: { screen: Categories},
    BarCode: { screen: BarCode},
    Bar: { screen: Bar},
    Kitchen: { screen: Kitchen},
    Reception: { screen: Reception},
}, {
    initialRouteName : "Home",
    headerMode: 'none',
});

export default AppNavigator;