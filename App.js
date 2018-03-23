import React, {Component} from 'react';
import {ThemeProvider} from "react-native-material-ui";
import {View} from "react-native";
import AppNavigator from "./AppNavigator";

const uiTheme = {
    palette: {},
    toolbar: {
        container: {},
    },
};

export default class App extends Component {

    render() {
        return (
            <ThemeProvider uiTheme={uiTheme}>
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <AppNavigator/>
                </View>
            </ThemeProvider>
        );
    }
}