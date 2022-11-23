//import React from 'react';
//import { StyleSheet, View, Text } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';

//
//  Login
//  Login-
//
//  Created by [Author].
//  Copyright © 2018 [Company]. All rights reserved.
//

import React from "react"
import { Image,ImageBackground, StyleSheet, Text, TextInput, Linking,TouchableOpacity, View,  Alert ,Dimensions,
	ActivityIndicator,ScrollView} from "react-native"

import authHelper   from "../Helper/Sessions";
import FlashMessage from "react-native-flash-message";
import Toast from 'react-native-tiny-toast';
import Constants from 'expo-constants';
import Moment from 'moment'; 
import * as Permissions from 'expo-permissions'; 
import * as Location from 'expo-location';

import  Modal,{SlideAnimation, ModalContent,ModalButton } from 'react-native-modals';
import "./../../global.js";

import connDBHelper   from "../Helper/Dao";
import connectionHelper   from "../Helper/Connection";

import Notifications   from "../Helper/PushNotifications";

import ErrorHandler    from "../Helper/ErrorHandler"

import PINCode from '@haskkor/react-native-pincode';


import CountDown from 'react-native-countdown-component';



import TimerMixin from 'react-timer-mixin';

import SubmitErrorButton from "../SubmitError/SubmitErrorButton";
import CodeFieldInput from "../Helper/CodeFieldInput"

import * as NotificationsKey from 'expo-notifications';

import LoginHeader from "../Headers/LoginHeader"





export default function Example() {
  const [items, setItems] = React.useState([
    { name: 'TURQUOISE', code: '#1abc9c' },
    { name: 'EMERALD', code: '#2ecc71' },
    { name: 'PETER RIVER', code: '#3498db' },
    { name: 'AMETHYST', code: '#9b59b6' },
    { name: 'WET ASPHALT', code: '#34495e' },
    { name: 'GREEN SEA', code: '#16a085' },
    { name: 'NEPHRITIS', code: '#27ae60' },
    { name: 'BELIZE HOLE', code: '#2980b9' },
    { name: 'WISTERIA', code: '#8e44ad' },
    { name: 'MIDNIGHT BLUE', code: '#2c3e50' },
    { name: 'SUN FLOWER', code: '#f1c40f' },
    { name: 'CARROT', code: '#e67e22' },
    { name: 'ALIZARIN', code: '#e74c3c' },
    { name: 'CLOUDS', code: '#ecf0f1' },
    { name: 'CONCRETE', code: '#95a5a6' },
    { name: 'ORANGE', code: '#f39c12' },
    { name: 'PUMPKIN', code: '#d35400' },
    { name: 'POMEGRANATE', code: '#c0392b' },
    { name: 'SILVER', code: '#bdc3c7' },
    { name: 'ASBESTOS', code: '#7f8c8d' },
  ]);

  return (
    <FlatGrid
      itemDimension={130}
      data={items}
      style={styles.gridView}
      // staticDimension={300}
      // fixed
      spacing={10}
      renderItem={({ item }) => (
        <View style={[styles.itemContainer, { backgroundColor: item.code }]}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCode}>{item.code}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
});