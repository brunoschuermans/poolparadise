import React, {Component} from 'react';
import {AsyncStorage, Button, FlatList, ScrollView, Text, View} from "react-native";
import {Toolbar} from "react-native-material-ui";
import AddItemToGuest from "./AddItemToReservation";

export default class Categories extends Component {

    state = {
        orderedItems: [],
    };

    componentWillMount() {
        this.getGuestFromStorage();
        this.getOrderedItemsFromStorage();
    }

    async getOrderedItemsFromStorage() {
        const orderedItems = await AsyncStorage.getItem("orderedItems");

        if (orderedItems) {
            this.setState({orderedItems: JSON.parse(orderedItems)});
            console.log(JSON.parse(orderedItems));
        }
    }

    async getGuestFromStorage() {
        const guest = await AsyncStorage.getItem("guest");

        if (guest) {
            this.setState({guest: JSON.parse(guest)});
            console.log(JSON.parse(guest));
        }
    }

    undo() {
        this.state.orderedItems.pop();
        console.log(this.state.orderedItems);
        this.setState({refresh: true});
        AsyncStorage.setItem("orderedItems", JSON.stringify(this.state.orderedItems));
    }

    total() {
        return this.state.orderedItems
            .map(item => item.price)
            .reduce((a, b) => a + b, 0);
    }

    clear() {
        AsyncStorage.removeItem("guest");
        AsyncStorage.removeItem("orderedItems");
        this.setState({
            guest: null,
            orderedItems: [],
        });
    }

    render() {
        return (
            <ScrollView
                style={{
                    flex: 1,
                }}
            >
                {this.renderButtons()}
                {this.renderGuestName()}
                {this.renderOrderedItems()}
            </ScrollView>
        );
    }

    renderButtons() {
        return (
            <View>
                <Toolbar
                    leftElement="home"
                    onLeftElementPress={() => this.props.navigation.navigate("Home")}
                    centerElement="Point Of Sell"
                />
                {
                    this.state.guest &&
                    <View>
                        <View
                            style={{
                                marginTop: 10,
                            }}
                        >
                            <Button title="Bar" onPress={() => this.props.navigation.navigate("Bar")}/>
                        </View>
                        <View
                            style={{
                                marginTop: 10,
                            }}
                        >
                            <Button title="Kitchen" onPress={() => this.props.navigation.navigate("Kitchen")}/>
                        </View>
                        <View
                            style={{
                                marginTop: 10,
                            }}
                        >
                            <Button title="Reception" onPress={() => this.props.navigation.navigate("Reception")}/>
                        </View>
                        <View
                            style={{
                                marginTop: 10,
                            }}
                        >
                            <Button title="Scan Item" onPress={() => this.props.navigation.navigate("ScanItem")}/>
                        </View>
                    </View>
                }
                {
                    !(this.state.guest) &&
                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Button title="Scan Guest" onPress={() => this.props.navigation.navigate("ScanGuest")}/>
                    </View>
                }
                {
                    this.state.orderedItems.length > 0 &&
                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Button title="Undo" onPress={() => this.undo()}/>
                    </View>
                }
            </View>
        );
    }

    renderGuestName() {
        return this.state.guest &&
            <View
                style={{
                    padding: 20,
                }}
            >
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                    }}>
                    {this.state.guest.guestName}
                </Text>
            </View>;
    }

    renderOrderedItems() {
        return this.state.guest &&
            <View>
                <View
                    style={{
                        padding: 20,
                    }}
                >
                    {
                        this.state.orderedItems.length > 0 &&
                        <View>
                            <FlatList
                                keyExtractor={(item, index) => index.toString()}
                                data={this.state.orderedItems}
                                renderItem={({item}) =>
                                    <Text
                                        key={Math.random()}
                                        style={{
                                            textAlign: "right",
                                        }}
                                    >
                                        {item.name} {item.price}
                                    </Text>
                                }
                            />
                            <Text
                                style={{
                                    textAlign: "right",
                                    fontWeight: "bold",
                                }}
                            >
                                TOTAL: {this.total()}
                            </Text>
                        </View>
                    }
                </View>
                {
                    this.state.orderedItems.length > 0 &&
                    <View
                        style={{
                            marginBottom: 20,
                        }}
                    >
                        <AddItemToGuest orderedItems={this.state.orderedItems} guest={this.state.guest}
                                        clear={this.clear.bind(this)}/>
                    </View>
                }
                <View
                    style={{
                        marginBottom: 20,
                    }}
                >
                    <Button title="Clear" onPress={() => this.clear()}/>
                </View>
            </View>;
    }
}
