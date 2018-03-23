import React, {Component} from 'react';
import {View} from "react-native";
import {RNCamera} from 'react-native-camera';

export default class BarCode extends Component {

    state = {};

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
            </View>
        );
    }
}
