import React, {Component} from 'react';
import {ActivityIndicator, AsyncStorage, Button, Text, View} from "react-native";
import {Toolbar} from "react-native-material-ui";

export default class Home extends Component {

    state = {
        loadingGuests: false,
        loadingItems: false,
        error: false,
    };

    componentWillMount() {
        this.getGuestsFromStorage();
        this.getItemsFromStorage();
    }

    async getGuestsFromStorage() {
        const guests = await AsyncStorage.getItem("guests");

        if (guests) {
            this.setState({guests: JSON.parse(guests)});
            console.log(JSON.parse(guests), "cached guests");
        } else {
            this.fetchToken(this.fetchGuests.bind(this));
        }
    }

    async getItemsFromStorage() {
        const items = await AsyncStorage.getItem("items");

        if (items) {
            this.setState({items: JSON.parse(items)});
            console.log(JSON.parse(items), "cached items");
        } else {
            this.fetchToken(this.fetchItems.bind(this));
        }
    }

    refreshData() {
        this.setState({error: false});

        AsyncStorage.removeItem("guest");
        AsyncStorage.removeItem("orderedItems");
        AsyncStorage.removeItem("guests");
        AsyncStorage.removeItem("items");

        this.fetchToken(this.fetchGuests.bind(this));
        this.fetchToken(this.fetchItems.bind(this));
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

    render() {
        return (
            <View style={{flex: 1}}>
                <Toolbar
                    rightElement="shopping-cart"
                    onRightElementPress={() => this.props.navigation.navigate("Categories")}
                    centerElement="Pool Paradise"
                />
                {this.renderButtons()}
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
                        title="Scan guest"
                        onPress={() => this.props.navigation.navigate("ScanGuest")}
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
            !this.state.error &&
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
                <ActivityIndicator size="large"/>
            </View>;
    }
}
