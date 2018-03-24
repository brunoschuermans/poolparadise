import React, {Component} from 'react';
import {AsyncStorage, View} from "react-native";
import {Toolbar} from "react-native-material-ui";
import {RNCamera} from "react-native-camera";

export default class ScanItem extends Component {

    state = {
        items: [],
        orderedItems: [],
        barCodeRead: false,
        flashLight: false,
    };

    componentWillMount() {
        this.getItemsFromStorage();
        this.getOrderedItemsFromStorage();
    }

    async getItemsFromStorage() {
        this.setState({
            items: JSON.parse(await AsyncStorage.getItem("items")),
        });
        console.log(JSON.parse(await AsyncStorage.getItem("items")));
    }

    async getOrderedItemsFromStorage() {
        const orderedItems = await AsyncStorage.getItem("orderedItems");

        if (orderedItems) {
            this.setState({orderedItems: JSON.parse(orderedItems)});
            console.log(JSON.parse(orderedItems));
        }
    }

    barCodeRead(event) {
        if(this.state.barCodeRead) {
            return;
        }

        const item = this.state.items
            .find(i => i.itemCode === event.data);

        console.log(item);

        this.order(item);
        this.setState({barCodeRead: true});
        this.props.navigation.navigate("Categories");
    }

    toggleFlashLight() {
        this.setState({flashLight: !this.state.flashLight});
    }

    order(item) {
        this.state.orderedItems.push(item);
        console.log(item);
        this.setState({refresh: true});
        AsyncStorage.setItem("orderedItems", JSON.stringify(this.state.orderedItems));
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                }}
            >
                <Toolbar
                    leftElement="shopping-cart"
                    onLeftElementPress={() => this.props.navigation.navigate("Categories")}
                    rightElement="highlight"
                    onRightElementPress={() => this.toggleFlashLight()}
                    centerElement="Scan Item"
                />
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    {
                        <RNCamera
                            style={{
                                flex: 1,
                            }}
                            flashMode={this.state.flashLight ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
                            onBarCodeRead={event => this.barCodeRead(event)}
                        />
                    }
                </View>
            </View>
        );
    }
}
