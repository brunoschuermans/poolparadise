import React, {Component} from 'react';
import {AsyncStorage, Button} from "react-native";

export default class AddItemToReservation extends Component {

    state = {
        loadingOrderedItems: false,
        error: false,
    };

    componentWillMount() {
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
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    error: true,
                });
            });
    }

    addItems() {
        this.setState({loadingOrderedItems: true});
        this.props.items.map(item => this.postItemToReservation(this.props.guest.reservationID, item.itemID));
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

                console.log(responseJson);

                AsyncStorage.setItem("items", JSON.stringify(responseJson.data));
                this.setState({loadingItems: false});
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    loadingOrderedItems: false,
                    error: true,
                });
            });
    }

    render() {
        return (
            <Button
                title="Add item(s) to guest"
                onPress={() => this.addItems()}
                disabled={this.state.loadingOrderedItems}
            />
        );
    }
}
