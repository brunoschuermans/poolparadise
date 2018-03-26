import React, {Component} from 'react';
import {ActivityIndicator, Button, Text, View} from "react-native";

export default class AddItemToReservation extends Component {

    state = {
        postingOrderedItems: false,
        error: false,
        orderedItemsPosted: false,
        postedItems: [],
    };

    addItems() {
        this.setState({postingOrderedItems: true});
        this.props.orderedItems.map(item => this.fetchToken(() => this.postItemToReservation(this.props.guest.reservationID, item.itemID)));
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

    postItemToReservation(reservationID, itemID) {
        fetch("https://hotels.cloudbeds.com/api/v1.1/postItemToReservation",
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Bearer " + this.state.accessToken,
                },
                body: "reservationID=" + reservationID + "&itemID=" + itemID + "&itemQuantity=1"
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

                this.state.postedItems.push(itemID);

                if (this.state.postedItems.length === this.props.orderedItems.length) {
                    this.setState({
                        orderedItemsPosted: true,
                        postingOrderedItems: true,
                    });
                    this.props.clear();
                }

                console.log(responseJson);
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    postingOrderedItems: false,
                    error: true,
                });
            });
    }

    render() {
        return (
            <View>
                {this.renderSuccess()}
                {this.renderError()}
                {this.renderLoading()}
                {
                    !this.state.postingOrderedItems &&
                    <Button
                        title="Add item(s) to guest"
                        onPress={() => this.addItems()}
                    />
                }
            </View>
        );
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

    renderSuccess() {
        return this.state.orderedItemsPosted &&
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Text style={{color: "green"}}>Transaction successful</Text>
            </View>;
    }

    renderLoading() {
        return this.state.postingOrderedItems &&
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
