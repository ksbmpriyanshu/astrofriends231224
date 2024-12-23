import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  ScrollView,
  Linking,
  Alert,
  Keyboard,
} from 'react-native';
import React, { useEffect } from 'react';
import MyStatusBar from '../../components/MyStatusbar';
import { api_url, colors, fonts, signup_google, api2_get_profile, getFontSize } from '../../config/Constants1';
import { useState } from 'react';
import MyLoader from '../../components/MyLoader';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as CustomerActions from '../../redux/actions/CustomerActions';
import { connect } from 'react-redux';
import CountryPicker from 'react-native-country-picker-modal';
import {
  GoogleSignin,

} from '@react-native-google-signin/google-signin';
import { success_toast, warnign_toast } from '../../components/MyToastMessage';
import * as AuthActions from '../../redux/actions/AuthActions'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../config/Screen';
import { logo, mainlogo } from '../../assets/images/Images';

const { width, height } = Dimensions.get('screen');

GoogleSignin.configure();

const Login = props => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState({ callingCode: '91', cca2: 'IN' });

  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);


  const login = async () => {
    try {
      const phoneRegex = /^\d{10}$/
      if (phoneNumber.length == 0) {
        warnign_toast('Please Enter Mobile Number');
      } else if (!phoneRegex.test(phoneNumber)) {
        warnign_toast('Please Enter Correct Mobile Number');
      } else {
        props.dispatch(AuthActions.onLogin({ phoneNumber: phoneNumber, }))
      }
    } catch (e) {
      console.log(e)
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background_theme2 }}>
      <MyStatusBar
        backgroundColor={colors.background_theme2}
        barStyle="light-content"
      />
      <MyLoader isVisible={isLoading} />
      <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:"#fff"}}>
        
      <Image source={mainlogo}
            style={{
               width: SCREEN_WIDTH * 0.8,
              height: SCREEN_HEIGHT * 0.22,
              alignSelf: 'center', 
              resizeMode: 'contain',
              marginTop: 5, 
              borderRadius: 25, 
              alignSelf: 'center', 
              marginTop: SCREEN_HEIGHT * 0.02,
              borderWidth:1 }} />
          
        <View
          style={{
            backgroundColor: '#FE6006',
            marginTop: 15,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            shadowColor: "#000000",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.20,
            shadowRadius: 5.62,
            elevation: 7,
            height: height*0.7,
            display:"flex",
            flexDirection:"column",
            justifyContent:"center",
            alignItems:"center",
          }}>

           <View >
            <Text style={{
              backgroundColor: "yellow", color: "#F45F4B",
              textAlign: 'center',
              fontSize: getFontSize(1.3),
              color: "#000",
              fontFamily: fonts.medium,
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: 0.7,
              marginBottom: 30,
              paddingVertical:6,
            }}>Guiding your journey through stars.</Text>
          <Text allowFontScaling={false}
            style={{
              textAlign: 'center',
              fontSize: getFontSize(2.3),
          color: "#fff",
              fontFamily: fonts.medium,
              fontWeight:"700",
              textTransform:"uppercase",
              letterSpacing:0.7
            }}>
            Welcome To {'\n'}AstroFriends
          </Text>
          
          <Text allowFontScaling={false}
            style={{
              textAlign: 'center',
              fontSize: getFontSize(1.3),

              color: "#fff",
              fontFamily: fonts.medium,
              marginTop:10,
            }}>
            Enter Your Mobile Number To Continue
          </Text>
          <KeyboardAvoidingView
            behavior={Platform.OS == 'android' ? 'padding' : 'height'}>
            <View
              style={{
                flex: 0,
                width: '85%',
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: "#fff",
                borderRadius: 25,
                marginBottom: 5,
                marginTop: 30
              }}>

              <Text allowFontScaling={false} style={{ fontSize: getFontSize(1.4), fontWeight: 'bold', paddingRight: 5, paddingLeft: 10, color:"#fff", fontFamily: fonts.medium }}>
                {` +${code.callingCode}`}
              </Text>
              <View>
                <Text allowFontScaling={false} style={{ borderRightWidth: 1, borderColor:"#fff", height: getFontSize(1.8) }}></Text>
              </View>
              <TextInput
                placeholder="Enter Your Mobile Number"
                placeholderTextColor="#fff"
                keyboardType="numeric"
                onChangeText={text => {

                  if (text.length > 0 && text[0] === '0') {

                    setPhoneNumber(text.slice(1));
                  } else {
                    setPhoneNumber(text);
                  }

                  if (text.length >= 10) {
                    Keyboard.dismiss();
                  }
                }}
                style={{ width: '100%', fontSize: getFontSize(1.4), padding: 8, color: '#fff' }}
                maxLength={10}
                onTouchEndCapture={() => console.log('bye')}
                underlineColorAndroid='transparent'
                onSubmitEditing={() => login()}
                cursorColor={colors.background_theme2}
                disableFullscreenUI={false}
              />
            </View>
          </KeyboardAvoidingView>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={login}
            style={{
              backgroundColor:"#fff",
              width:"100%",
              alignSelf:"center",
              display:"flex",
              flexDirection:"row",
              alignItems:"center",
              gap:10,
              paddingHorizontal:40,
              paddingVertical:6,
              marginVertical:10,
              borderRadius:100,

            }}>
            <Text allowFontScaling={false} style={{ fontSize: getFontSize(1.8),  fontWeight: 'bold', color: "#F45F4B", }}>
              GET OTP
            </Text>
            <AntDesign
              name="rightcircle"
              color={"#F45F4B"}
              size={18}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              width: '75%',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10
            }}>
            <Text allowFontScaling={false}
              style={{
                fontSize: getFontSize(1.2),
                color: 'black',
                fontFamily: 'medium',
                marginTop: 2,
                textAlign: 'center',
              }}>
              By Signing up, you agree to our{' '}
              <Text allowFontScaling={false}
                style={{ fontSize: getFontSize(1.2), color: '#fff', paddingTop: 10 }}
                onPress={() => Linking.openURL('https://astrofriends.in/terms-and-conditions')}
              >
                Terms And Conditions
              </Text>{' '}
              and{' '}
              <Text allowFontScaling={false}
                style={{ fontSize: getFontSize(1.2), color: '#fff' }}
                onPress={() => Linking.openURL('https://astrofriends.in/privacy-policy')}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(null, mapDispatchToProps)(Login);


const styles = StyleSheet.create({
  loginButtonContainer: {
    flex: 0,
    width: '40%',
    paddingVertical: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white_color,
    borderWidth: 1,
    borderColor: colors.background_theme4
  },
  loginButtonText: {
    fontSize: getFontSize(1.4),
    color: colors.background_theme4,
    fontFamily: fonts.medium,
  },
});
