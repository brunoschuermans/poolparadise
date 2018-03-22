import React, {Component} from 'react';
import {Button, View} from "react-native";

export default class Categories extends Component {

    static navigationOptions = {
        title: "Point of sell",
    };

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                }}
            >
                <View
                    style={{
                        marginBottom: 20,
                    }}
                >
                    <Button title="Bar" onPress={() => this.props.navigation.navigate("Bar")}/>
                </View>
                <View
                    style={{
                        marginBottom: 20,
                    }}
                >
                    <Button title="Kitchen" onPress={() => this.props.navigation.navigate("Kitchen")}/>
                </View>
                <View
                    style={{
                        marginBottom: 20,
                    }}
                >
                    <Button title="Reception" onPress={() => this.props.navigation.navigate("Reception")}/>
                </View>
            </View>
        );
    }
}
