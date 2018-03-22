import React, {Component} from 'react';
import {AsyncStorage, Button, ScrollView, View} from "react-native";
import {storeGuest} from "./App";

export default class Bar extends Component {

    state = {
        items: [],
        orderedItems: [],
    };

    static navigationOptions = {
        title: "Bar",
    };

    componentWillMount() {
        this.getItemsFromStorage();
        this.getOrderedItemsFromStorage();
    }

    async getItemsFromStorage() {
        this.setState({items: JSON.parse(await AsyncStorage.getItem("items"))});
    }

    async getOrderedItemsFromStorage() {
        const orderedItems = await AsyncStorage.getItem("orderedItems");

        if (orderedItems) {
            this.setState({orderedItems: JSON.parse(orderedItems)});
        }
    }

    order(item) {
        this.state.orderedItems.push(item);
        this.setState({refresh: true});
        AsyncStorage.setItem("orderedItems", JSON.stringify(this.state.orderedItems));
    }

    countItem(item) {
        return this.state.orderedItems.filter(i => i.itemID === item.itemID).length;
    }

    render() {
        return (
            <ScrollView>
                {
                    this.state.items
                        .filter(item => item.categoryName === "BAR")
                        .map((item, index) =>
                            (
                                <View
                                    key={index}
                                    style={{
                                        marginBottom: 10,
                                    }}
                                >
                                    <Button
                                        title={item.name + this.renderCountItem(item)}
                                        fullWidth={true}
                                        color="#841584"
                                        onPress={() => this.order(item)}
                                    />
                                </View>
                            )
                        )
                }
            </ScrollView>
        );
    }

    renderCountItem(item) {
        const countItem = this.countItem(item);
        return (countItem === 0)
            ? ""
            : " (" + countItem + ")";
    }
}
