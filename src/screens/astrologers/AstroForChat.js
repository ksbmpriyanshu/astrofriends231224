import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  TextInput,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { api_astrolist1, api_url, colors, fonts } from '../../config/Constants1';
import MyLoader from '../../components/MyLoader';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MyHeader from '../../components/MyHeader';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { connect } from 'react-redux';
import * as AstrologerActions from '../../redux/actions/AstrologerActions';
import { base_url } from '../../config/constants';
import * as ChatActions from '../../redux/actions/ChatActions';
import { Colors, Sizes } from '../../assets/style';
import Stars from 'react-native-stars';
import HomeHeader from '../../components/HomeHeader';
import { ActivityIndicator } from 'react-native-paper';

const { width, height } = Dimensions.get('screen');

let timeout;

const AstroForChat = ({
  chatListData,
  navigation,
  dispatch,
  isRefreshing,
  isMoreLoading
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [noData, setNoData] = useState(false); // Added state for handling no data

  useFocusEffect(
    useCallback(() => {
      dispatch(AstrologerActions.getChatAstroData());
      return () => setSearch(''); // Reset search on focus
    }, [dispatch])
  );

  const searchFilterFunction = text => {
    setSearch(text);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      dispatch(AstrologerActions.getChatAstroData(text));
      clearTimeout(timeout);
    }, 1500);
  };

  useEffect(() => {
    setNoData(chatListData?.length === 0 && search.length > 0)
  }, [chatListData, search]);

  const rounditem = item => {
    const wallet = item.toString();
    return wallet.slice(0, 4);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'online':
        return '#29bf12';
      case 'offline':
        return '#00000040';
      case 'busy':
        return '#fca311';
      default:
        return 'white';
    }
  };

  const renderItems = ({ item, index }) => {
    const onChat = astroData => {
      const payload = {
        type: 'chat',
        astrologerName: astroData?.astrologerName,
        language: astroData?.language,
        astrologerId: astroData?._id,
        chatPrice: parseFloat(astroData?.chat_price) + parseFloat(astroData?.commission_chat_price),
        astrostatus:astroData?.chat_status,
      };
      dispatch(ChatActions.onChatNow(payload));
    };

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() =>
          navigation.navigate('astrologerDetailes', {
            _id: item?._id,
            type: 'chat',
          })
        }
        key={index}
        style={{
          flex: 0,
          width: width * 0.95,
          marginHorizontal: width * 0.025,
          alignSelf: 'center',
          backgroundColor: colors.white_color,
          borderRadius: 10,
          marginVertical: 10,
          shadowColor: colors.black_color5,
          shadowOffset: { width: 2, height: 1 },
          shadowOpacity: 5,
          shadowRadius: 10,
          zIndex: 100,
          elevation: 5,
          overflow: 'hidden'
        }}
      >
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            backgroundColor: colors.background_theme1,
            borderRadius: 16,
            elevation: 3
          }}
        >
          <View style={{ width: '30%', height: '100%' }}>
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                overflow: 'hidden',
                padding: 10,
              }}
            >
              <Image
                source={{ uri: base_url + item.profileImage }}
                style={{
                  width: width * 0.23,
                  height: width * 0.25,
                  borderRadius: 5,
                  borderWidth: 0.5,
                  borderColor: colors.black_color8,
                  resizeMode: 'cover',
                  marginBottom:5,
                }}
              />
              <View style={{ flex: 0.3, alignItems: 'center' }}>
                {/* <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 13,
                    color: colors.black_color,
                    fontFamily: fonts.medium,
                    marginTop: 5,
                    textAlign: 'center',
                  }}
                >
                  {`${parseFloat(item?.rating).toFixed(0) ?? 1}/5`}
                </Text> */}
                <Stars
                  default={item?.rating ?? 1}
                  disabled
                  count={5}
                  half={true}
                  starSize={20}
                  fullStar={<Ionicons name={'star'} size={10} color={"#f7b31c"} />}
                  emptyStar={<Ionicons name={'star-outline'} size={10} color={"#f7b31c"} />}
                  halfStar={<Ionicons size={14} name={'star-half'} style={{ color: Colors.primaryLight }} />}
                />
                <Text
                allowFontScaling={false}
                style={{
                  fontSize:9,
                  color: "#bababa",
                  fontFamily: fonts.medium,
                  marginTop:1,
                  textAlign: 'center',
                }}>
                Review:({item?.totalRating})
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 0, width: '70%', padding: 20,paddingBottom:5, }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 14,
                color: colors.black_color9,
                fontFamily: fonts.semi_bold,
                textAlign: 'left',
                fontWeight: 'bold'
              }}
            >
              {item.astrologerName}
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 12,
                color: colors.black_color9,
                fontFamily: fonts.semi_bold,
                textAlign: 'left'
              }}
            >
              {`Experience: ${item.experience} Year`}
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 12,
                color: colors.black_color9,
                fontFamily: fonts.semi_bold,
                textAlign: 'left'
              }}
            >
              {`Language: ${item?.language.join(', ')}`}
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 12,
                color: colors.black_color9,
                fontFamily: fonts.semi_bold,
                textAlign: 'left'
              }}
            >
              {`Followers: ${item?.follower_count}`}
            </Text>
            <TouchableOpacity
              disabled={item?.chat_status === 'offline' || item?.chat_status === 'busy'}
              onPress={() => onChat(item)}
              style={{
                flex: 0,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                backgroundColor: getStatusColor(item.chat_status),
                marginVertical: 15,
                borderRadius: 10
              }}
            >
              <Ionicons name="chatbubble-ellipses-sharp" color={"#fff"} size={12} />
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 12,
                  color: "#fff",
                  fontFamily: fonts.medium,
                  marginLeft: 5
                }}
              >
                {`₹ ${rounditem(parseFloat(item?.chat_price) + parseFloat(item?.commission_chat_price))}/min`}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: 'absolute',
              paddingHorizontal: 10,
              paddingVertical: Sizes.fixPadding * 0.1,
              right: 0,
              width: '25%',
              borderTopRightRadius: 10,
              borderBottomLeftRadius: 10,
              backgroundColor: getStatusColor(item.chat_status)
            }}
          >
            <Text
              allowFontScaling={false}
              style={{
                color: 'white',
                fontSize: 12,
                fontWeight: 'bold',
                textAlign: 'center',
                textTransform: 'capitalize'
              }}
            >
              {item.chat_status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.black_color1 }}>
      <MyLoader isVisible={isLoading} />
      <HomeHeader navigation={navigation} />
      <View style={{ flex: 1 }}>
        {searchInfo()}
        {noData ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: colors.white_color, fontSize: 16, fontFamily: fonts.medium, color: "black" }}>
              No Data Found
            </Text>
          </View>
        ) : (
          <FlatList
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => {
              setSearch('');
              dispatch(AstrologerActions.onRefreshChatAstrologer());
            }} />}
            ListHeaderComponent={<>{chatListData && astrologerInfo()}</>}
            ListFooterComponent={<View style={{ height: 50 }}>
              {isMoreLoading && <ActivityIndicator color={Colors.primaryLight} size={'small'} />}
            </View>}
            onEndReached={() => dispatch(AstrologerActions.getMoreChatAstroData(search))}
          />
        )}
      </View>
    </View>
  );

  function astrologerInfo() {
    return (
      <FlatList
        data={chatListData}
        renderItem={renderItems}
        keyExtractor={item => item?._id}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 50 }}>
          {isMoreLoading && <ActivityIndicator color={Colors.primaryLight} size={'small'} />}
        </View>}
        onEndReached={() => dispatch(AstrologerActions.getMoreChatAstroData(search))}
      />
    );
  }

  function searchInfo() {
    return (
      <View
        style={{
          flex: 0,
          backgroundColor: colors.background_theme1,
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            flex: 0,
            width: '95%',
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            borderRadius: 1000,
            borderWidth: 1,
          }}
        >
          <Ionicons name="search" color={colors.black_color6} size={22} />
          <TextInput
            value={search}
            placeholder="Search Astrologer by name..."
            placeholderTextColor={colors.black_color6}
            onChangeText={text => searchFilterFunction(text)}
            style={{
              width: '100%',
              fontFamily: fonts.medium,
              color: colors.black_color8,
              padding: 8,
            }}
          />
        </View>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  chatListData: state.astrologer.chatListData,
  isRefreshing: state.setting.isRefreshing,
  isMoreLoading: state.setting.isMoreLoading
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(AstroForChat);
