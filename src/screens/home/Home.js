import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  StyleSheet,
  Animated,
  ImageBackground,
  RefreshControl,
  Linking,
  PermissionsAndroid,
  Platform,
  Alert,
  FlatList,
  PixelRatio,
  BackHandler,
  AppState,
  Modal,
  TouchableWithoutFeedback,
  SafeAreaView,
  TextInput,
} from 'react-native';
import React from 'react';
import Carousel from 'react-native-reanimated-carousel';
import { useEffect, useRef } from 'react';
import {
  api_url,
  blog,
  colors,
  fonts,
  getFontSize,
  updateFlash,
} from '../../config/Constants1';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as HomeActions from '../../redux/actions/HomeActions';
import * as EcommerceActions from '../../redux/actions/ecommerceActions';
import { base_url, get_astro_blogs, img_url } from '../../config/constants';
import HomeSimmer from './components/HomeSimmer';
import { Sizes, Fonts, Colors } from '../../assets/style';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeHeader from '../../components/HomeHeader';
import MyStatusBar from '../../components/MyStatusbar';
import { SCREEN_HEIGHT } from '../../config/Screen';
import * as BlogActions from '../../redux/actions/BlogActions';
import * as PoojaActions from '../../redux/actions/PoojaActions';
import * as AstrologerActions from '../../redux/actions/AstrologerActions';

const { width, height } = Dimensions.get('screen');

const Home = ({
  props,
  navigation,
  dispatch,
  productCategoryData,
  isRefreshing,
  homeSimmer,
  bannerData,
  callAstrologer,
  chatAstrologer,
  astroBlogData,
  customerData,
  videoCallAstrologers,
  poojaData,
  videoCallAstrolgoer,
  newPoojaData
}) => {
  const [astoListData, setAstroListData] = useState(false);
  const [livelist, setLivelist] = useState(null);
  const [ModalView, setModalView] = useState(null);
  const [modalVisible, setModalVisible] = useState(true);
  const [search, setSearchInput] = useState('');
  const [masterDataSource, setMasterDataSource] = useState([]);

  const { t } = useTranslation();
  console.log(customerData?._id)

  useEffect(() => {
    dispatch(HomeActions.getHomeData());
    dispatch(EcommerceActions.getProductCategory());
    dispatch(BlogActions.getAstroBlogs());
    dispatch(PoojaActions.getPoojaData())
    dispatch(PoojaActions.getNewPoojaData())
    dispatch(PoojaActions.getAllPoojaList())
    // dispatch(AstrologerActions.getVideoCallAstrologers());
  }, [dispatch]);
  // console.log(newPoojaData,'pooja data found ')
  const update_flash = () => {
    axios({
      method: 'post',
      url: api_url + updateFlash,
      data: {
        user_id: customerData?._id,
      },
    })
      .then(res => { })
      .catch(err => {
        console.log(err);
      });
  };

  const openYouTubeVideo = youtubeLink => {
    // Assuming the youtubeLink is a valid YouTube video URL
    Linking.openURL(youtubeLink);
  };

  const astrologer_list = item => {
    navigation.navigate('astrologerList', { routename: item });
  };

  const getStatusColor = status => {
    switch (status) {
      case 'online':
        return '#29bf12';
      case 'offline':
        return '#6c757d';
      case 'busy':
        return '#fca311';
      default:
        return 'white';
    }
  };

  const searchFilterFunction = text => {
    if (text) {
      const newData = masterDataSource.filter(item => {
        const itemData = item.owner_name
          ? item.owner_name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.includes(textData); // Use includes for partial matching
      });

      setAstroListData(newData);
      setvastulist(newData);
      setOtherVastuList(newData);
      setSearchInput(text);
    } else {
      on_referesh();
      setAstroListData(astoListData);
      setvastulist(vastulist);
      setOtherVastuList(othervastulist);
      setSearchInput(text);
    }
  };

  const _listEmptyComponent = () => {
    return (
      <View
        style={{
          alignSelf: 'center',
          marginTop: 20,
          marginBottom: 20,
          alignSelf: 'center',
        }}>
        <Text
          allowFontScaling={false}
          style={{
            color: '#000',
            textAlign: 'center',
            marginHorizontal: width * 0.35,
          }}>
          {t('NoVideo')}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <MyStatusBar
        backgroundColor={colors.background_theme2}
        barStyle="light-content"
      />
      <View style={{ flex: 1, backgroundColor: colors.black_color1 }}>
        <HomeHeader navigation={navigation} />
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => dispatch(HomeActions.getHomeDataOnRefresh())}
            />
          }
          ListHeaderComponent={
            <>
              {homeSimmer ? (
                <HomeSimmer />
              ) : (
                <>
                  {/* {sreaching()} */}
                  {kundliInfo()}
                  {bannerData && bannerInfo()}
                  {livelist && liveListInfo()}
                  {callAstrologer && callAstrologerListInfo()}
                  {chatAstrologer && chatAstrologerList()}
                  {videoCallAstrolgoer && videoCallAstrologerList()}
                  {/* {OtherExperts()} */}
                  {/* {blogsInfo()} */}
                  {mallInfo()}
                  {astropooja()}

                  {/* {footerInfo()} */}
                </>
              )}
            </>
          }
        />
      </View>
      {astoListData && customerData?.flash_seen == 0 && (
        <Modal visible={modalVisible} transparent={true}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#00000050',
                justifyContent: 'center',
                alignItems: 'center',
                // opacity: 0.4
              }}>
              <View
                style={{
                  flex: 0,
                  width: '90%',
                  alignSelf: 'center',
                  backgroundColor: colors.background_theme2,
                  borderRadius: 10,
                }}>
                <TouchableOpacity
                  style={{ padding: 10, left: width * 0.75 }}
                  onPress={() => {
                    update_flash();
                    setModalVisible(false);
                  }}>
                  <Ionicons name="close" color={colors.white_color} size={25} />
                </TouchableOpacity>
                <View
                  style={{
                    position: 'absolute',
                    alignSelf: 'center',
                    borderRadius: 1000,
                    borderWidth: 10,
                    overflow: 'hidden',
                    top: -60,
                    backgroundColor: 'white',
                    padding: 10,
                    borderColor: colors.background_theme2,
                  }}>
                  <Image
                    source={require('../../assets/images/ganesha.png')}
                    style={{ width: 70, height: 70 }}
                  />
                </View>
                <View
                  style={{
                    flex: 0,
                    padding: 15,
                    backgroundColor: colors.background_theme1,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }}>
                  {ModalView && (
                    <>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                        }}>
                        {ModalView.image.map((imageUrl, index) => (
                          <View key={index}>
                            <Image
                              source={{ uri: imageUrl }}
                              style={{
                                width: width * 0.2,
                                height: width * 0.2,
                                borderRadius: (width * 0.22) / 2,
                                borderWidth: 1,
                                borderColor: 'black',
                                alignSelf: 'center',
                                overflow: 'hidden',
                              }}
                            />
                          </View>
                        ))}
                      </View>
                      <View
                        style={{
                          alignItems: 'center',
                          marginTop: 20,
                          marginBottom: 20,
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={{ color: 'black', fontSize: getFontSize(2.6) }}>
                          {ModalView.text}
                        </Text>
                      </View>
                    </>
                  )}

                  <TouchableOpacity
                    onPress={() => astrologer_list('astroChatList')}
                    style={{
                      alignSelf: 'center',
                      backgroundColor: colors.background_theme2,
                      borderRadius: 10,
                      padding: 10,
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: 'black',
                      }}>
                      {t('chat_now')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
  function astropooja() {
    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('PoojaDetails2', { ...item })}
          style={{ margin: 10, overflow: 'hidden', elevation: 2   }}>
          <Image
            source={{ uri: img_url + item?.image }}
            style={{
              width: 100,
              height: 100,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              borderWidth: 1,
              backgroundColor: "#bababa",
              borderColor: "#bababa",
              resizeMode: 'stretch',
            }}
          />
          <Text
            style={{
              color: colors.white_color,
              textAlign: 'center',
              marginTop: 5,
              paddingBottom:5,
  
              backgroundColor: "#F45F4B",
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              // borderWidth: 1,
              top: -5,
              fontSize:10,
              width: 100,
            }}>
            {item?.pujaName}
            {/* Vivah Badha Nivaran Puja */}
          </Text>
          {/* <View style={{ position: 'absolute', backgroundColor: Colors.white, padding: Sizes.fixPadding * 0.5, right: 0, paddingHorizontal: Sizes.fixPadding, borderBottomLeftRadius: 10, borderWidth: 1 }}>
            <Text style={{ ...Fonts.black16RobotoMedium }}>{item?.type}</Text>
          </View> */}
        </TouchableOpacity>
      )
    };
    return (
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 10,
            alignItems: 'center',
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: getFontSize(1.4),
              color: colors.black_color,
              fontFamily: fonts.medium,
            }}
>
            {/* {t('e-commerce')} */}
            {t('Astro_Pooja')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={
              () =>
                navigation.navigate('astromallCategory')
            }
            style={{
              paddingHorizontal: 10,
              paddingVertical: 3,
              elevation: 15,
              shadowColor: colors.background_theme2,
              borderRadius: 20,
              backgroundColor: colors.white_color,
            }}>
            <Text
            allowFontScaling={false}
            style={{
              fontSize: getFontSize(1),
              color: colors.black_color,
              fontFamily: fonts.medium,
              paddingHorizontal: 5,
              paddingVertical: 2,
              fontWeight:"800"
            }}>
            {t('view_all')}
          </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={newPoojaData}
          renderItem={renderItem}
          // keyExtractor={item => item.id}
          horizontal={true} // Change to true for horizontal scroll
        />
      </ScrollView>
    )
  }

  function footerInfo() {
    return (
      <View style={styles.info}>
        <View style={styles.row}>
          {/* <TouchableOpacity
            style={styles.box2}
            onPress={() => navigation.navigate('Notes')}>
            <Image
              source={require('../../assets/images/icon/home_notes.png')}
              style={{
                width: 60,
                height: 60,
                alignSelf: 'center',
                resizeMode: 'contain',
              }}
            />
            <Text allowFontScaling={false} style={styles.boxtext}>
              {t('daily')}
            </Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity
            style={styles.box2}
            onPress={() => navigation.navigate('DownloadKundali')}>
            <Image
              source={require('../../assets/images/icon/download.png')}
              style={{
                width: 60,
                height: 60,
                alignSelf: 'center',
                resizeMode: 'contain',
              }}
            />
            <Text allowFontScaling={false} style={styles.boxtext}>
              {t('free_pdf')}
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.box2}
            onPress={() => navigation.navigate('DailyPanchang')}>
            <Image
              source={require('../../assets/images/icon/hinduism.png')}
              style={{
                width: 60,
                height: 60,
                alignSelf: 'center',
                resizeMode: 'contain',
              }}
            />
            <Text allowFontScaling={false} style={styles.boxtext}>
              {t('daily_panchang')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.box2}
            onPress={() => navigation.navigate('auspicions')}>
            <Image
              source={require('../../assets/images/muhurat.png')}
              style={{
                width: 85,
                height: 85,
                alignSelf: 'center',
                resizeMode: 'contain',
              }}
            />
            <Text allowFontScaling={false} style={styles.boxtext}>
              {t('muhurat')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{}}
            onPress={() => navigation.navigate('birhatHoroscope')}>
            <Image
              source={require('../../assets/images/icon/astrology.png')}
              style={{
                width: 60,
                height: 60,
                alignSelf: 'center',
                resizeMode: 'contain',
              }}
            />
            <Text allowFontScaling={false} style={styles.boxtext}>
              {t('birhat')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.row, {}]}>
          <TouchableOpacity
            style={styles.box2}
            onPress={() => navigation.navigate('magazine')}>
            <Image
              source={require('../../assets/images/icon/book.png')}
              style={{
                width: 60,
                height: 60,
                alignSelf: 'center',
                resizeMode: 'contain',
              }}
            />
            <Text allowFontScaling={false} style={styles.boxtext}>
              {t('magazine')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.box2}
            onPress={() => navigation.navigate('religion')}>
            <Image
              source={require('../../assets/images/icon/pray.png')}
              style={{
                width: 60,
                height: 60,
                alignSelf: 'center',
                resizeMode: 'contain',
              }}
            />
            <Text allowFontScaling={false} style={styles.boxtext}>
              {t('religion')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{}}
            onPress={() => navigation.navigate('remedies')}>
            <Image
              source={require('../../assets/images/icon/medicine.png')}
              style={{
                width: 60,
                height: 60,
                alignSelf: 'center',
                resizeMode: 'contain',
              }}
            />
            <Text allowFontScaling={false} style={styles.boxtext}>
              {t('remedies')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.row, {}]}>
          <TouchableOpacity
            style={styles.box2}
            onPress={() =>
              openYouTubeVideo('https://www.youtube.com/@AstroKunjofficial')
            }>
            <Image
              source={require('../../assets/images/icon/youtube_1.png')}
              style={{
                width: 60,
                height: 60,
                alignSelf: 'center',
                resizeMode: 'contain',
              }}
            />
            <Text allowFontScaling={false} style={styles.boxtext}>
              {t('youtube')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.box2}
            onPress={() => navigation.navigate('yellowBook')}>
            <Image
              source={require('../../assets/images/book1.png')}
              style={{
                width: 80,
                height: 70,
                alignSelf: 'center',
                resizeMode: 'contain',
              }}
            />
            <Text allowFontScaling={false} style={styles.boxtext}>
              {t('yellow_book')}
            </Text>
          </TouchableOpacity>
        </View>
        {/* <View style={[styles.row1, {}]}>

          <TouchableOpacity
            style={{ ...styles.box2, marginTop: 0 }}
            onPress={() =>
              openYouTubeVideo('http://www.omshivmaa.blogspot.in')
            }>
            <Image
              source={require('../../assets/images/icon/blog1.png')}
              style={{
                width: 55,
                height: 55,
                alignSelf: 'center',
                resizeMode: 'contain',
              }}
            />
            <Text
              allowFontScaling={false}
              style={{ ...styles.boxtext, marginTop: 10 }}>
              {t('oma')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.box2}
            onPress={() => navigation.navigate('askQuestion')}>
            <Image
              source={require('../../assets/images/ask_ques.png')}
              style={{
                width: 100,
                height: 90,
                alignSelf: 'center',
                resizeMode: 'contain',
              }}
            />
            <Text allowFontScaling={false} style={styles.boxtext}>
              {t('ask_a_question')}
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    );
  }

  function liveListInfo() {
    const live = (live_ud, astroId, data) => {
      if (customerData.username != null) {
        navigation.navigate('goLive', {
          liveID: live_ud,
          astro_id: astroId,
          userID: customerData.id,
          userName: customerData.username,
          astroData: data,
        });
      } else {
        Alert.alert('Message', 'Please Update Customer Account.');
      }
    };

    const renderItems = ({ item, index }) => {
      return item.current_status1 === 'Live' ? (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => live(item.live_id, item.user_id, item)}
          key={index}
          style={{
            flex: 0,
            width: width * 0.355,
            borderRadius: 5,
            marginVertical: 10,
            shadowColor: colors.black_color5,
            shadowOffset: { width: 2, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            zIndex: 100,
            marginHorizontal: 20,
          }}>
          <View
            style={{
              borderRadius: 10,
              borderColor: '#ddd',
              backgroundColor: colors.background_theme2,
            }}>
            <View
              style={{
                height: 150,
                alignItems: 'center',
              }}>
              <Image
                source={{ uri: item.img_url }}
                style={{
                  width: width * 0.25,
                  height: width * 0.25,
                  borderRadius: 100,
                  borderWidth: 0.5,
                  borderColor: colors.white_color,
                  marginTop: 10,
                }}
              />
              <View style={{}}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: getFontSize(1.2),
                    color: colors.black_color9,
                    fontFamily: fonts.semi_bold,
                    paddingRight: 10,
                    textAlign: 'center',
                  }}>
                  {item.owner_name}
                </Text>
                <View
                  style={{
                    flex: 0.9,
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={require('../../assets/images/live_gif.gif')}
                    style={{ width: 102, height: 25 }}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ) : null;
    };
    return (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            allowFontScaling={false}
            style={{
              color: 'black',
              marginHorizontal: 10,
              fontSize: getFontSize(1.8),
            }}>
            {t('astrologer_live')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('astrolive', { data: 'home' })}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 3,
              elevation: 15,
              shadowColor: colors.background_theme2,
              borderRadius: 20,
              backgroundColor: colors.white_color,
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 12,
                color: colors.black_color,
                fontFamily: 'BalluBhai-Regular',
                fontWeight: '800',
                paddingHorizontal: 5,
                paddingVertical: 2,
              }}>
              {t('view_all')}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={livelist}
          renderItem={renderItems}
          keyExtractor={item => item.id}
          numColumns={1}
          ListEmptyComponent={_listEmptyComponent}
          showsVerticalScrollIndicator={false}
          horizontal
          centerContent={true}
        />
      </View>
    );
  }

  function sreaching() {
    return (
      <View
        style={{
          flex: 0,
          width: '95%',
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          borderRadius: 5,
          backgroundColor: colors.white_color,
          elevation: 5,
          shadowColor: colors.black_color6,
          marginTop: '2%',
        }}>
        <Ionicons name="search" color={colors.black_color7} size={20} />
        <TextInput
          value={search}
          placeholder="Search Experts by name..."
          placeholderTextColor={colors.black_color5}
          onChangeText={text => searchFilterFunction(text)}
          style={{
            width: '100%',
            fontFamily: 'BalluBhai-Regular',
            color: colors.black_color8,
            padding: 8,
          }}
        // onFocus={() => navigation.navigate('astroForChat')}
        />
      </View>
    );
  }

  function videoCallAstrologerList() {
    const renderItems = ({ item, index }) => {

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          key={index}
          onPress={() =>
            navigation.navigate('astrologerDetailes', {
              _id: item?._id,
              type: 'video',
            })
            // navigation.navigate('AstroForVideo', {
            //   _id: item?._id,
            //   type: 'video',
            // })
          }
          style={{
            width: width * 0.4,
            borderRadius: 6,
            marginHorizontal: 10,
            backgroundColor: getStatusColor(item?.call_status),
            shadowColor: Colors.gray,
            shadowOffset: {
              width: 2,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 8,
            marginBottom: Sizes.fixPadding,
          }}>
          <Text
            style={{
              ...Fonts.white14RobotoMedium,
              textAlign: 'center',
              textTransform: 'capitalize',
              fontSize:10,
            }}>
            {item?.video_call_status}
          </Text>
          <View
            style={[
              styles.box,
              { borderColor: getStatusColor(item?.video_call_status) },
            ]}>
            <Image
              source={{ uri: base_url + item?.profileImage }}
              style={{
                width:"100%",
                height: width * 0.25,
                resizeMode:"cover",
              }}
            />
               <View style={{paddingHorizontal:6,paddingVertical:10,paddingTop:5,}}>
            <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
            <View>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: getFontSize(1.2),
                color: colors?.black_color,
                fontFamily: fonts.medium,
                width:90,
              }}>
              {item?.astrologerName}
            </Text>
            </View>
            
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: getFontSize(1),
                    color: colors.black_color6,
                    fontFamily: fonts.medium,
                  }}>
                  {`${parseFloat(item?.rating).toFixed(0)}/5`}
                </Text>
                <Image
                  source={require('../../assets/images/icon/star.png')}
                  style={{ width: 10, height: 10 }}
                />
              </View>
              
            </View>
            <Text
                allowFontScaling={false}
                style={{
                  fontSize: getFontSize(1.2),
                  color: Colors.primaryLight,
                  fontFamily: fonts.medium,
                  marginTop:10,
                }}>
                Followers: {item?.follower_count}
              </Text>
              <Text
              allowFontScaling={false}
              style={{
                color: "#666464",
                fontFamily: fonts.medium,
                fontSize:10,
                }}>
              ₹ {Number(item?.normal_video_call_price || 0) + Number(item?.commission_normal_video_call_price || 0)}/min
            </Text>
          </View>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <SafeAreaProvider style={{ marginBottom: Sizes.fixPadding }}>
        <View
          style={{
            flex: 0,
            width: '95%',
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 15,
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: getFontSize(1.4),
              color: colors.black_color,
              fontFamily: fonts.medium,
            }}>
           {t('video_astrologer')}{' '}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            // onPress={() => navigation.navigate('astroForChat')}
            onPress={() => navigation.navigate('astroForVideo')}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 3,
              elevation: 15,
              shadowColor: colors.background_theme2,
              borderRadius: 20,
              backgroundColor: colors.white_color,
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: getFontSize(1),
                color: colors.black_color,
                fontFamily: fonts.medium,
                paddingHorizontal: 5,
                paddingVertical: 2,
                fontWeight:"800"
              }}>
              {t('view_all')}
            </Text>
          </TouchableOpacity>
        </View>
        {videoCallAstrolgoer.length === 0 ? (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: Colors.grayA }}>No Chat Astrologer Online</Text>
          </View>
        ) : (
          <FlatList data={videoCallAstrolgoer} horizontal renderItem={renderItems} />
        )}
      </SafeAreaProvider>
    );
  }

  function chatAstrologerList() {
    const renderItems = ({ item, index }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          key={index}
          onPress={() =>
            navigation.navigate('astrologerDetailes', {
              _id: item?._id,
              type: 'chat',
            })
          }
          style={{
            width: width * 0.4,
            borderRadius: 6,
            marginHorizontal: 10,
            backgroundColor: getStatusColor(item?.call_status),
            shadowColor: Colors.gray,
            shadowOffset: {
              width: 2,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 8,
            marginBottom: Sizes.fixPadding,
          }}>
          <Text
            style={{
              ...Fonts.white14RobotoMedium,
              textAlign: 'center',
              textTransform: 'capitalize',
              fontSize:10,
            }}>
            {item?.chat_status}
          </Text>
          <View
            style={[
              styles.box,
              { borderColor: getStatusColor(item?.chat_status) },
            ]}>
            <Image
              source={{ uri: base_url + item?.profileImage }}
              style={{
                width:"100%",
                height: width * 0.25,
                resizeMode:"cover",
              }}
            />
             <View style={{paddingHorizontal:6,paddingVertical:10,paddingTop:5,}}>
            <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
            
            <View>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: getFontSize(1.2),
                color: colors?.black_color,
                fontFamily: fonts.medium,
                width:90,
              }}>
              {item?.astrologerName}
            </Text>
            </View>
            
              <View
                 style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: getFontSize(1),
                    color: colors.black_color6,
                    fontFamily: fonts.medium,
                  }}>
                  {`${parseFloat(item?.rating).toFixed(0)}/5`}
                </Text>
                <Image
                  source={require('../../assets/images/icon/star.png')}
                  style={{ width: 10, height: 10 }}
                />
              </View>
             
            
          </View>
          <Text
                allowFontScaling={false}
                style={{
                  fontSize: getFontSize(1),
                  color: Colors.primaryLight,
                  fontFamily: fonts.medium,
                marginTop:10,
                 
                }}>
                Followers: {item?.follower_count}
              </Text>
              <Text
              allowFontScaling={false}
              style={{
                color: "#666464",
                fontFamily: fonts.medium,
                fontSize:10,
                }}>
              ₹ {Number(item?.chat_price || 0) + Number(item?.commission_chat_price || 0)}/min
            </Text>
          </View>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <SafeAreaProvider style={{ marginBottom: Sizes.fixPadding }}>
        <View
          style={{
            flex: 0,
            width: '95%',
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 15,
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: getFontSize(1.4),
              color: colors.black_color,
              fontFamily: fonts.medium,
            }}>
            {t('chat_astrologer')}{' '}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('astroLive')}

            style={{
              paddingHorizontal: 10,
              paddingVertical: 3,
              elevation: 15,
              shadowColor: colors.background_theme2,
              borderRadius: 20,
              backgroundColor: colors.white_color,
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: getFontSize(1),
                color: colors.black_color,
                fontFamily: fonts.medium,
                paddingHorizontal: 5,
                paddingVertical: 2,
                fontWeight:"800"
              }}>
              {t('view_all')}
            </Text>
          </TouchableOpacity>
        </View>
        {chatAstrologer.length === 0 ? (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: Colors.grayA }}>No Chat Astrologer Online</Text>
          </View>
        ) : (
          <FlatList data={chatAstrologer} horizontal renderItem={renderItems} />
        )}
      </SafeAreaProvider>
    );
  }

  function callAstrologerListInfo() {
    const renderItems = ({ item, index }) => {

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          key={index}
          onPress={() =>
            navigation.navigate('astrologerDetailes', {
              _id: item?._id,
              type: 'vastu',
            })
          }
          style={{
            width: width * 0.4,
            borderRadius: 6,
            marginHorizontal: 10,
            backgroundColor: getStatusColor(item?.call_status),
            shadowColor: Colors.gray,
            shadowOffset: {
              width: 2,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 8,
            marginBottom: Sizes.fixPadding,
          }}>
          <Text
            style={{
              ...Fonts.white14RobotoMedium,
              textAlign: 'center',
              textTransform: 'capitalize',
              fontSize:10,
            }}>
            {item?.call_status}
          </Text>
          <View
            style={[
              styles.box,
              { borderColor: getStatusColor(item?.call_status) },
            ]}>
            <Image
              source={{ uri: base_url + item?.profileImage }}
              style={{
                width:"100%",
                height: width * 0.25,
                resizeMode:"cover",
              }}
            />
            <View style={{paddingHorizontal:6,paddingVertical:10,paddingTop:5,}}>
            <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
              <View>
               <Text
              allowFontScaling={false}
              style={{
                fontSize: getFontSize(1.2),
                color: colors?.black_color,
                fontFamily: fonts.medium,
                width:90,
              }}>
              {item?.astrologerName}
            </Text>
            </View>
            
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: getFontSize(1),
                    color: colors.black_color6,
                    fontFamily: fonts.medium,
                  }}>
                  {`${parseFloat(item?.rating).toFixed(0)}/5`}
                </Text>
                <Image
                  source={require('../../assets/images/icon/star.png')}
                  style={{ width: 10, height: 10 }}
                />
     
             </View>
            </View>
            <Text
                allowFontScaling={false}
                style={{
                  fontSize: getFontSize(1),
                  color: Colors.primaryLight,
                  fontFamily: fonts.medium,
                  marginTop:5,
                }}>
                Followers: {item?.follower_count}
              </Text>
              <Text
              allowFontScaling={false}
              style={{
                color: "#666464",
                fontFamily: fonts.medium,
                fontSize:10,
                }}>
              ₹ {Number(item?.call_price || 0) + Number(item?.commission_call_price || 0)}/min
            </Text>
          </View>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <SafeAreaProvider>
        <View
          style={{
            flex: 0,
            width: '95%',
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 15,
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: getFontSize(1.4),
              color: colors.black_color,
              fontFamily: fonts.medium,
            }}>
            {t('call_astrologer')}{' '}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('astroForCall')}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 3,
              elevation: 15,
              shadowColor: colors.background_theme2,
              borderRadius: 20,
              backgroundColor: colors.white_color,
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: getFontSize(1),
                color: colors.black_color,
                fontFamily: fonts.medium,
                paddingHorizontal: 5,
                paddingVertical: 2,
                fontWeight:"800"
              }}>
              {t('view_all')}
            </Text>
          </TouchableOpacity>
        </View>

        {callAstrologer.length === 0 ? (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: Colors.grayA }}>No Call Astrologer Online</Text>
          </View>
        ) : (
          <FlatList
            data={callAstrologer}
            horizontal
            renderItem={renderItems}
            keyExtractor={item => item?.id?.toString()} // Use a unique key for each item
          />
        )}
      </SafeAreaProvider>
    );
  }

  function OtherExperts() {
    const renderItems = ({ item, index }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          key={index}
          onPress={() =>
            navigation.navigate('astrologerDetailes', {
              _id: item?._id,
              type: 'call',
            })
          }
          style={{
            width: width * 0.4,
            borderRadius: 10,
            marginHorizontal: 10,
            backgroundColor: getStatusColor(item?.call_status),
            shadowColor: Colors.gray,
            shadowOffset: {
              width: 2,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 8,
            marginBottom: Sizes.fixPadding,
          }}>
          <Text
            style={{
              ...Fonts.white14RobotoMedium,
              textAlign: 'center',
              textTransform: 'capitalize',
            }}>
            {item?.call_status}
          </Text>
          <View
            style={[
              styles.box,
              { borderColor: getStatusColor(item?.call_status) },
            ]}>
            <Image
              source={{ uri: base_url + item?.profileImage }}
              style={{
                width: width * 0.18,
                height: width * 0.18,
                borderRadius: 1000,
                borderWidth: 1,
                borderColor: colors.background_theme2,
                alignSelf: 'center',
                overflow: 'hidden',
                marginTop: Sizes.fixPadding,
              }}
            />
            <Text
              allowFontScaling={false}
              style={{
                fontSize: getFontSize(1.6),
                color: colors?.black_color,
                fontFamily: fonts.medium,
                textAlign: 'center',
                marginBottom: Sizes.fixPadding,
                marginTop: Sizes.fixPadding * 0.5,
              }}>
              {item?.astrologerName}
            </Text>
            <View
              style={{
                paddingLeft: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: getFontSize(1.4),
                    color: colors.black_color6,
                    fontFamily: fonts.medium,
                  }}>
                  {`${parseFloat(item?.rating).toFixed(0)}/5`}
                </Text>
                <Image
                  source={require('../../assets/images/icon/star.png')}
                  style={{ width: 15, height: 15 }}
                />
              </View>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: getFontSize(1.2),
                  color: Colors.primaryLight,
                  fontFamily: fonts.medium,
                  textAlign: 'center',
                  marginBottom: Sizes.fixPadding,
                }}>
                Followers: {item?.follower_count}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <SafeAreaProvider>
        <View
          style={{
            flex: 0,
            width: '95%',
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 15,
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: getFontSize(1.6),
              color: colors.black_color,
              fontFamily: fonts.medium,
            }}>
            {t('Other_experts')}{' '}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('astroForCall')}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 3,
              elevation: 15,
              shadowColor: colors.background_theme2,
              borderRadius: 20,
              backgroundColor: colors.white_color,
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 12,
                color: colors.black_color,
                fontFamily: 'BalluBhai-Regular',
                fontWeight: '800',
                paddingHorizontal: 5,
                paddingVertical: 2,
              }}>
              {t('view_all')}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList data={callAstrologer} horizontal renderItem={renderItems} />
      </SafeAreaProvider>
    );
  }

  function kundliInfo() {
    return (
      <ScrollView
        nestedScrollEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 8 }}>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 5,
          }}>
          <View style={{ alignContent: 'center', alignSelf: 'center' }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('kundli')}
              style={styles.panchangContainer}>
              <Image
                source={require('../../assets/images/kundlilogo/logo3.png')}
                style={styles.panchangImage}
              />
            </TouchableOpacity>
            <Text allowFontScaling={false} style={styles.punchangText}>
              {t('kundli')}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('newMatching')}
              style={styles.panchangContainer}>
              <Image
                source={require('../../assets/images/kundlilogo/matchmaking.png')}
                style={styles.panchangImage}
              />
            </TouchableOpacity>
            <Text allowFontScaling={false} style={styles.punchangText}>
              {t('matching')}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('selectSign')}
              style={styles.panchangContainer}>
              <Image
                source={require('../../assets/images/kundlilogo/horoscope-one.png')}
                style={styles.panchangImage}
              />
            </TouchableOpacity>
            <Text allowFontScaling={false} style={styles.punchangText}>
              {t('rashi_report')}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('numerology')}
              style={styles.panchangContainer}>
              <Image
                source={require('../../assets/images/kundlilogo/numerology-one.png')}
                style={styles.panchangImage}
              />
            </TouchableOpacity>
            <Text allowFontScaling={false} style={styles.punchangText}>
              {t('numerology')}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('panchange')}
              style={styles.panchangContainer}>
              <Image
                source={require('../../assets/images/kundlilogo/krishnamurtipadti.png')}
                style={styles.panchangImage}
              />
            </TouchableOpacity>
            {/* <Text allowFontScaling={false} style={styles.punchangText}>
              Panchang
            </Text> */}
             <Text allowFontScaling={false} style={styles.punchangText}>
              {t('panchang')}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  function bannerInfo() {
    const renderItem = ({ index, item }) => {

      const handlePress = () => {
        const url = item?.redirectionUrl; // Replace with your desired URL
        const urlPattern = new RegExp(
          '^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$',
          'i', // fragment locator
        );
        if (url && urlPattern.test(url)) {
          Linking.openURL(url).catch(err => {
            // console.error("Failed to open URL", err);
            // Alert.alert("Error", "Failed to open URL.");
          });
        } else {
          Alert.alert('Invalid URL', 'The provided URL is not valid.');
        }
      };

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={handlePress}>
          <Image
            source={{ uri: img_url + item.bannerImage }}
            style={{ width: width * 0.95, height: SCREEN_HEIGHT*0.14, borderRadius: 10 }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    };
    return (
      <Carousel
        loop
        width={width}
        height={SCREEN_HEIGHT*0.14}
        autoPlay={true}
        data={bannerData}
        scrollAnimationDuration={1500}
        autoPlayInterval={5000}
        renderItem={renderItem}
      />
    );
  }

  function blogsInfo() {
    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('blogDetailes', {
              blogData: item,
            })
          }
          style={{ margin: 10, overflow: 'hidden', elevation: 5 }}>
          <Image
            source={{ uri: img_url + item?.image }}
            style={{
              width: 200,
              height: 100,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              resizeMode: 'stretch',
            }}
          />
          <Text
            style={{
              textAlign: 'center',
              marginTop: 5,
              backgroundColor: colors.background_theme2,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              top: -5,
              width: 200,
              height: 20,
              color: colors.white_color
            }}>
            {' '}
            {item.title}
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 10,
          }}>
          <Text
            allowFontScaling={false}
            style={{
              color: 'black',
              // marginHorizontal: 10,
              fontSize: getFontSize(1.8),
            }}>
            {t('blogs')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('astroBlog')}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 3,
              elevation: 15,
              shadowColor: colors.background_theme2,
              borderRadius: 20,
              backgroundColor: colors.white_color,
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 12,
                color: colors.black_color,
                fontFamily: 'BalluBhai-Regular',
                fontWeight: '800',
                paddingHorizontal: 5,
                paddingVertical: 2,
              }}>
              {t('view_all')}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={astroBlogData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal={true}
        />
      </ScrollView>
    );
  }

  function mallInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        onPress={() => navigation.navigate('products', { ...item })}
        style={{ margin: 10,marginRight:0, overflow: 'hidden', elevation: 2, }}>
        <Image
          source={{ uri: img_url + item?.image }}
          style={{
            width: 100,
            height: 100,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            borderWidth: 1,
            // borderColor:Colors.backgroundColor.pri
            backgroundColor: "#bababa",
            borderColor: "#bababa",
            resizeMode: 'stretch',
          }}
        />
        <Text
          style={{
            color: colors.white_color,
            textAlign: 'center',
            marginTop: 5,
            paddingBottom:5,

            backgroundColor: "#F45F4B",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            // borderWidth: 1,
            top: -5,
            fontSize:10,
            width: 100,

          }}>
          {item?.categoryName}
        </Text>
      </TouchableOpacity>
    );

    return (
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 10,
            alignItems: 'center',
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: getFontSize(1.4),
              color: colors.black_color,
              fontFamily: fonts.medium,
            }}
>
            {t('e-commerce')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('productCategory', { data: 'home' })
            }
            style={{
              paddingHorizontal: 10,
              paddingVertical: 3,
              elevation: 15,
              shadowColor: colors.background_theme2,
              borderRadius: 20,
              backgroundColor: colors.white_color,
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: getFontSize(1),
                color: colors.black_color,
                fontFamily: fonts.medium,
                paddingHorizontal: 5,
                paddingVertical: 2,
                fontWeight:"800"
              }}>
              {t('view_all')}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={productCategoryData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal={true} // Change to true for horizontal scroll
        />
      </ScrollView>
    );
  }
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
  notificationData: state.customer.notificationData,
  firebaseId: state.customer.firebaseId,
  bannerData: state.home.bannerData,
  callAstrologer: state.home.callAstrologer,
  chatAstrologer: state.home.chatAstrologer,
  // videoCallAstrologers: state.astrologer.videoCallAstrologers,
  homeSimmer: state.home.homeSimmer,
  isRefreshing: state.setting.isRefreshing,
  productCategoryData: state.ecommerce.productCategoryData,
  astroBlogData: state.blogs.astroBlogData,
  poojaData: state.pooja.poojaData,
  newPoojaData: state.pooja.newPoojaData,
  videocallInvoiceVisble: state.chat.videocallInvoiceVisble,
  videoCallAstrolgoer: state.home.videoCallAstrolgoer,

});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  panchangContainer: {
    width: width * 0.18,
    height: width * 0.18,
    backgroundColor: '#48cae4',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 9,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: colors.black_color6,
  },

  punchangText: {
    fontSize: getFontSize(1),
    fontWeight: '400',
    fontFamily: fonts.medium,
    color: 'black',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  box: {
    backgroundColor: colors.white_color,
    borderWidth: 1,
    borderColor: 'orange',
    flex: 1,
    borderBottomLeftRadius:6,
    borderBottomRightRadius:6,
  },
  box2: {
    alignSelf: 'center',
  },
  boxtext: {
    textAlign: 'center',
    fontSize: getFontSize(1.5),
    fontWeight: 'bold',
    paddingTop: 5,
    color: 'black',
  },
  row: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'center',
    borderBottomWidth: 1, // Add a border to the bottom of each row
    borderColor: '#dee2e6',
    marginTop: 10,
    marginBottom: 10,
  },
  row1: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  info: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    margin: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  panchangImage: {
    width: width * 0.13,
    height: width * 0.13,
    resizeMode: 'contain',
    borderRadius: 1000,
  },
});
