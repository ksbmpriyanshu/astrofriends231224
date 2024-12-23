import { View, Text, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import React, { useEffect } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';FontAwesome

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, fonts, getFontSize } from '../config/Constants1';
import { connect } from 'react-redux';
import { openFacebook, openInstagram, openYoutube } from './Methods';
import { useTranslation } from 'react-i18next';
import { showNumber, showNumber0 } from '../utils/services';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../config/Screen';
import { Sizes } from '../assets/style';
import { mainlogo } from '../assets/images/Images';

const { width, height } = Dimensions.get('screen');
const HomeHeader = props => {
  const { t } = useTranslation();

  useEffect(()=>{
    console.log("cus-data",props?.customerData)
    if(props?.customerData?.banned_status){
      Alert.alert("AstroFriends","You are banned, Please contact administrator")
      props.navigation.navigate('login')
    }
  },[])

  return (
    <View
      style={{
        flex: 0,
        width: '100%',
        // alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        backgroundColor: colors.white_color,
      
        
      }}>
        <View style={{flexDirection:'row',alignItems:'center',gap:5,}}>

        
      <TouchableOpacity
        activeOpacity={0.8}
        // style={{}}
        onPress={() => props.navigation.openDrawer()}
        // onPress={() => console.log('first')}
        style={{elevation:3,zIndex:4,}}>
        <Feather name="menu"  color={colors.black_color} size={30} />
      </TouchableOpacity>
       {/* <Image source={mainlogo}
        style={{ width: SCREEN_WIDTH*0.08, height: SCREEN_HEIGHT*0.05,  resizeMode:'center',marginLeft:Sizes.fixPadding }} />   
        */}

        <Text style={{color:"#F45F4B",fontSize:16,fontWeight:"800",textTransform:"uppercase"}}>Astro Friends</Text>
        </View>      
        <View style={{flexDirection:'row',alignItems:'center'}}>


          <TouchableOpacity 
          style={{}}
          onPress={()=>props.navigation.navigate('language')}>
              <FontAwesome
                        name="language"
                        color={colors.background_theme2}
                        size={getFontSize(2.3)}
                      />
          </TouchableOpacity>

        
      <TouchableOpacity
        onPress={() => props.navigation.navigate('notifications')}
        style={{ flexDirection: 'row',marginHorizontal:Sizes.fixPadding }}>
        {
          props?.notificationCounts != 0 && <View
            style={{
              flex: 0.1,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: getFontSize(1.2),
              justifyContent: 'center',
              position: 'absolute',
              left: getFontSize(1.3),
              bottom: getFontSize(1.3),
              zIndex: 1,
            }}>
            <Text allowFontScaling={false}
              style={{
                fontSize: getFontSize(1.2),
                fontFamily: fonts.medium,
                textAlign: 'center',
                color: colors.red_color1,

              }}>
              {props?.notificationCounts ?? ''}
            </Text>
          </View>
        }
        <AntDesign name="bells" color={colors.black_color8} size={getFontSize(2.2)} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('wallet')}
        style={{
          // flex: 0.3,
          flexDirection: 'row',
          backgroundColor: "#FE6006",
          alignItems:"center", 
          borderRadius: 15,
          justifyContent: 'center',
          paddingHorizontal:getFontSize(0.8),
          paddingVertical:getFontSize(0.7)
        }}>
        <Ionicons name="wallet" color={"#fff"} size={15} />
        <Text allowFontScaling={false}
          style={{
            fontSize: getFontSize(1.2),
            color: colors.black_color,
            fontFamily: fonts.medium,
            marginLeft: 5,
            color:"#fff"
          }}>
            {/* {"₹ 86"} */}
          {showNumber0(props.customerData?.wallet_balance ?? 0)}
          {/* {"₹"+Math.floor(props.customerData?.wallet_balance)} */}
        </Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  notificationData: state.customer.notificationData,
  notificationCounts: state.customer.notificationCounts,
});

export default connect(mapStateToProps)(HomeHeader);
