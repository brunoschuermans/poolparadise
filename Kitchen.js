import React, {Component} from 'react';
import {AsyncStorage, Button, ScrollView, View} from "react-native";
import {storeGuest} from "./App";
import {Toolbar} from "react-native-material-ui";

export default class Kitchen extends Component {

    state = {
        items: [],
        orderedItems: [],
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
            <View
                style={{
                    flex: 1,
                }}
            >
                <Toolbar
                    leftElement="home"
                    onLeftElementPress={() => this.props.navigation.navigate("Home")}
                    rightElement="shopping-cart"
                    onRightElementPress={() => this.props.navigation.navigate("Categories")}
                    centerElement="Kitchen"
                />
                <ScrollView>
                    {
                        this.state.items
                            .filter(item => item.categoryName === "KITCHEN")
                            .sort((a, b) => (a.name > b.name) ? 1 : -1)
                            .map((item, index) =>
                                (
                                    <View
                                        key={index}
                                        style={{
                                            marginTop: 10,
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
            </View>
        );
    }

    renderCountItem(item) {
        const countItem = this.countItem(item);
        return (countItem === 0)
            ? ""
            : " (" + countItem + ")";
    }
}
