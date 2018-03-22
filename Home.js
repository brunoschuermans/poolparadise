import React, {Component} from 'react';
import {ActivityIndicator, AsyncStorage, Button, FlatList, Text, View} from "react-native";
import AddItemToGuest from "./AddItemToReservation";

export default class Home extends Component {

    state = {
        loadingGuests: false,
        loadingItems: false,
        error: false,
    };

    componentWillMount() {
        this.fetchToken(() => {
            this.getGuestsFromStorage();
            this.getItemsFromStorage();
            this.getGuestFromStorage();
            this.getOrderedItemsFromStorage();
        });
    }

    async getGuestsFromStorage() {
        const guests = await AsyncStorage.getItem("guests");

        if (guests) {
            this.setState({guests: JSON.parse(guests)});
        } else {
            this.fetchGuests();
        }
    }

    async getItemsFromStorage() {
        const items = await AsyncStorage.getItem("items");

        if (items) {
            this.setState({items: JSON.parse(items)});
        } else {
            this.fetchItems();
        }
    }

    async getGuestFromStorage() {
        const guest = await AsyncStorage.getItem("guest");

        if (guest) {
            console.log(guest);
            this.setState({guest: JSON.parse(guest)});
        }
    }

    async getOrderedItemsFromStorage() {
        const orderedItems = await AsyncStorage.getItem("orderedItems");

        if (orderedItems) {
            this.setState({orderedItems: JSON.parse(orderedItems)});
        }
    }

    refreshData() {
        this.fetchToken(() => {
            this.fetchGuests();
            this.fetchItems();
        });
    }

    clear() {
        AsyncStorage.removeItem("guest");
        AsyncStorage.removeItem("orderedItems");
        this.setState({
            refresh: true,
            guest: null,
            orderedItems: null,
        });
    }

    fetchToken(onFulfilled) {
        fetch("https://refresh-token-198718.appspot.com",
            {
                method: 'GET',
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error(response.statusText);
            })
            .then(responseJson => {
                if (!responseJson.success) {
                    throw new Error(responseJson.message);
                }

                this.setState({accessToken: responseJson.access_token});
                onFulfilled();
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    error: true,
                });
            });
    }

    fetchGuests() {
        this.setState({loadingGuests: true});
        fetch("https://hotels.cloudbeds.com/api/v1.1/getGuestList?includeGuestInfo=true&status=checked_in",
            {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + this.state.accessToken,
                },
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error(response.statusText);
            })
            .then(responseJson => {
                if (!responseJson.success) {
                    throw new Error(responseJson.message);
                }

                console.log(responseJson);

                AsyncStorage.setItem("guests", JSON.stringify(responseJson.data));
                this.setState({loadingGuests: false});
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    loadingGuests: false,
                    error: true,
                });
            });
    }

    fetchItems() {
        this.setState({loadingItems: true});
        fetch("https://hotels.cloudbeds.com/api/v1.1/getItems",
            {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + this.state.accessToken,
                },
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error(response.statusText);
            })
            .then(responseJson => {
                if (!responseJson.success) {
                    throw new Error(responseJson.message);
                }

                console.log(responseJson);

                AsyncStorage.setItem("items", JSON.stringify(responseJson.data));
                this.setState({loadingItems: false});
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    loadingItems: false,
                    error: true,
                });
            });
    }

    total() {
        return this.state.orderedItems
            .map(order => order.price)
            .reduce((a, b) => a + b, 0);
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {this.renderButtons()}
                {this.renderGuestName()}
                {this.renderOrderedItems()}
                {this.renderLoading()}
                {this.renderError()}
            </View>
        );
    }

    renderButtons() {
        return !(this.state.loadingGuests || this.state.loadingItems) &&
            <View>
                <View
                    style={{
                        marginTop: 20,
                        marginBottom: 20,
                    }}
                >
                    <Button
                        title="Select guest"
                        onPress={() => this.props.navigation.navigate("Guests")}
                    />
                </View>
                <View
                    style={{
                        marginBottom: 20,
                    }}
                >
                    <Button
                        title="Refresh data"
                        onPress={() => this.refreshData()}
                    />
                </View>
                <View
                    style={{
                        marginBottom: 20,
                    }}
                >
                    <Button
                        title="bar code"
                        onPress={() => this.props.navigation.navigate("BarCode")}
                    />
                </View>
            </View>;
    }

    renderOrderedItems() {
        return !(this.state.loadingGuests || this.state.loadingItems) &&
            !this.state.error &&
            this.state.orderedItems &&
            <View>
                <View
                    style={{
                        padding: 20,
                    }}
                >
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.orderedItems}
                        renderItem={({item}) =>
                            <Text
                                key={Math.random()}
                                style={{
                                    textAlign: "right",
                                }}>
                                {item.name} {item.price}
                            </Text>
                        }
                    />
                    <Text>TOTAL: {this.total()}</Text>
                </View>
                <View
                    style={{
                        marginBottom: 20,
                    }}
                >
                    <AddItemToGuest items={this.state.orderedItems} guest={this.state.guest}/>
                </View>
                <View
                    style={{
                        marginBottom: 20,
                    }}
                >
                    <Button title="Clear" onPress={() => this.clear()}/>
                </View>
            </View>;
    }

    renderGuestName() {
        return !(this.state.loadingGuests || this.state.loadingItems) &&
            !this.state.error &&
            this.state.guest &&
            <View
                style={{
                    padding: 20,
                }}
            >
                <Text style={{fontSize: 25}}>{this.state.guest.guestName}</Text>
            </View>;
    }

    renderError() {
        return this.state.error &&
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Text style={{color: "red"}}>An error occured</Text>
            </View>;
    }

    renderLoading() {
        return (this.state.loadingGuests || this.state.loadingItems) &&
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
                <ActivityIndicator size="large"/>
            </View>;
    }
}
