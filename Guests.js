import React, {Component} from 'react';
import {Button, View} from "react-native";
import {AsyncStorage} from "react-native";

export default class Guests extends Component {

    state = {
        guests: [],
    };

    componentWillMount() {
        this.getGuestsFromStorage();
    }

    async getGuestsFromStorage() {
        this.setState({
            guests: JSON.parse(await AsyncStorage.getItem("guests")),
        });
    }

    static navigationOptions = {
        title: "Guests"
    };

    render() {
        return (
            <View>
                {
                    this.state.guests
                        .filter(guest => guest.guestName.indexOf("BRUNO") !== -1)
                        .map((guest, index) =>
                        (
                            <View
                                key={index}
                                style={{
                                    marginTop: 10,
                                }}
                            >
                                <Button
                                    title={guest.guestName}
                                    fullWidth={true}
                                    onPress={() => {
                                        AsyncStorage.setItem("guest", JSON.stringify(guest));
                                        this.props.navigation.navigate("Categories");
                                    }}
                                />
                            </View>
                        )
                    )
                }
            </View>
        );
    }
}
