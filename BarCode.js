import React, {Component} from 'react';
import {Text, View} from "react-native";
import {RNCamera} from 'react-native-camera';

export default class BarCode extends Component {

    state = {};

    static navigationOptions = {
        title: "Bar code"
    };

    render() {
        return (
            <View
                style={{
                    flex: 1,
                }}
            >
                {
                    !this.state.barcode &&
                    <RNCamera
                        style={{
                            flex: 1,
                        }}
                        onBarCodeRead={event => this.setState({barcode: event.data})}
                    />
                }
                {
                    this.state.barcode &&
                    <Text>{this.state.barcode}</Text>
                }
            </View>
        );
    }
}
