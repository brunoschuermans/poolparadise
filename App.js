import React, {Component} from 'react';
import {ThemeProvider, Toolbar} from "react-native-material-ui";
import {View} from "react-native";
import AppNavigator from "./AppNavigator";
import {NavigationActions} from "react-navigation";

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
                    <Toolbar
                        leftElement="home"
                        onLeftElementPress={() => this.appNavigator.dispatch(NavigationActions.navigate({
                            type: NavigationActions.NAVIGATE,
                            routeName: "Home",
                        }))}
                        centerElement="Pool Paradise"
                    />
                    <AppNavigator ref={appNavigator => this.appNavigator = appNavigator}/>
                </View>
            </ThemeProvider>
        );
    }
}