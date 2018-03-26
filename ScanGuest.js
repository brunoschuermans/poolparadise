import React, {Component} from 'react';
import {AsyncStorage, View} from "react-native";
import {Toolbar} from "react-native-material-ui";
import {RNCamera} from "react-native-camera";

export default class ScanGuest extends Component {

    state = {
        guests: [],
        barCodeRead: false,
        flashLight: false,
    };

    componentWillMount() {
        this.getGuestsFromStorage();
    }

    async getGuestsFromStorage() {
        this.setState({
            guests: JSON.parse(await AsyncStorage.getItem("guests")),
        });
    }

    toggleFlashLight() {
        this.setState({flashLight: !this.state.flashLight});
    }

    barCodeRead(event) {
        if (this.state.barCodeRead) {
            return;
        }

        const guest = this.state.guests
            .filter(guest => guest.guestNotes.length > 0)
            .find(guest => guest.guestNotes[0].note === event.data);

        console.log(guest);

        AsyncStorage.setItem("guest", JSON.stringify(guest));
        this.setState({
            barCodeRead: true,
            flashLight: false,
        });
        this.props.navigation.navigate("Categories");
    }

    render() {
        return <View
            style={{
                flex: 1,
            }}
        >
            <Toolbar
                leftElement="home"
                onLeftElementPress={() => this.props.navigation.navigate("Home")}
                rightElement="highlight"
                onRightElementPress={() => this.toggleFlashLight()}
                centerElement="Scan Guest"
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
        </View>;
    }
}
