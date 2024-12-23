import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import MyStatusBar from '../../components/MyStatusbar'
import { Colors, Sizes, Fonts } from '../../assets/style'
import MyHeader from '../../components/MyHeader'
import { FlatList } from 'react-native'
import { showNumber } from '../../utils/services'
import * as AstromallActions from '../../redux/actions/astromallActions'
import { colors, getFontSize } from '../../config/Constants1'
import { api_url, base_url, img_url } from '../../config/constants'
import * as PoojaActions from '../../redux/actions/PoojaActions';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../config/Screen'
import Carousel from 'react-native-reanimated-carousel'
import * as HomeActions from '../../redux/actions/HomeActions'
import * as actionType from "../../redux/actionTypes"
import { useNavigation } from '@react-navigation/native'
import { responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions'

const PoojaList = ({ route, dispatch, newPoojaData, customerData, bookpujaHistoryData }) => {
    const [toggle, setToggle] = useState(false);
    const poojaData = route?.params
    const navigation = useNavigation()
    console.log("poojaData22", bookpujaHistoryData)
    useEffect(() => {
        dispatch(HomeActions.getHomeData());
        dispatch(PoojaActions.getNewPoojaData())
        dispatch(PoojaActions.getBookPoojaHistory(customerData))
        dispatch(PoojaActions.setBookPoojaHistory())
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <MyStatusBar backgroundColor={colors.background_theme2} barStyle={'light-content'} />
            <View style={{}}>
                <MyHeader title={'Puja'} navigation={navigation} />
                <FlatList
                    style={{}}
                    ListHeaderComponent={<>
                        {/* {Banner()} */}
                        {Button(toggle, setToggle)}
                        {(!toggle) ? List() : HistoryData(bookpujaHistoryData)}
                    </>}
                />
            </View>
        </View>
    )


    function Button(toggle, setToggle) {
        return (
            <View style={{ flexDirection: "row", justifyContent: "space-around", backgroundColor: "black", paddingVertical: SCREEN_WIDTH * 0.02, }}>
                <TouchableOpacity
                    onPress={() => setToggle(!toggle)}
                    style={[styles.button, toggle && { backgroundColor: "black" }]}>
                    <Text style={{ color: toggle ? "white" : "black", fontSize: getFontSize(1.8) }}>Puja</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setToggle(!toggle)}
                    style={[styles.button, !toggle && { backgroundColor: "black" }]}>
                    <Text style={{ color: !toggle ? "white" : "black", fontSize: getFontSize(1.8) }}>History</Text>
                </TouchableOpacity>
            </View>
        )
    }

    function List() {
        const renderItem = ({ item }) => (
            <View style={styles.pujaMainContainer}>
                <View>
                    <Image
                        source={{ uri: img_url + item?.image }}
                        style={{
                            height: responsiveScreenHeight(15), width: SCREEN_WIDTH * 0.46, borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10
                        }}
                        resizeMode="cover"
                    />
                </View>
                <View>
                    <Text style={{ color: "white", fontSize: getFontSize(1), fontWeight: "500",marginBottom:5,width:90}}>{item?.pujaName}</Text>
                    <Text style={{ color: "white", fontSize: getFontSize(1.2), fontWeight: "500",marginBottom:5 }}>{"₹" + item?.price}</Text>
                    <TouchableOpacity style={styles.btn}
                        onPress={() => navigation.navigate('PoojaDetails2', { navigation, ...item })}
                    >
                        <Text style={{ textAlign: "center", color: "black", fontSize: getFontSize(1.4), fontWeight: "500", elevation: 4 }}>View More</Text>
                    </TouchableOpacity>
                </View>
            </View>

        );
        return (
            <View style={styles.list}>
                <FlatList
                    data={newPoojaData}
                    renderItem={renderItem}
                    // keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />
                <View style={{paddingVertical:30,}}></View>
            </View>
        )
    }
}


function HistoryData(bookpujaHistoryData) {
    const navigation = useNavigation()
    const renderItem = ({ item }) => (
        console.log("first11111", item),
        <View style={styles.pujaMainContainer}>
        <View>
            <Image
                source={{ uri: img_url + item?.poojaId?.image }}
                style={{
                    height: responsiveScreenHeight(15), width: SCREEN_WIDTH * 0.46, borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10
                }}
                resizeMode="cover"
            />
        </View>
        <View>
            <Text style={{ color: "white", fontSize: getFontSize(1), fontWeight: "500",marginBottom:5,width:90}}>{item?.poojaId.pujaName}</Text>
            <Text style={{ color: "white", fontSize: getFontSize(1.2), fontWeight: "500",marginBottom:5 }}>{"₹" + item?.price}</Text>
            <TouchableOpacity style={styles.btn}onPress={() => navigation.navigate('bookedPoojaDetails', { item })}
            >
                <Text style={{ textAlign: "center", color: "black", fontSize: getFontSize(1.4), fontWeight: "500", elevation: 4 }}>{item?.status}</Text>
            </TouchableOpacity>
        </View>
    </View>
        // <View style={styles.banner}>
        //     <Image
        //         source={{ uri: img_url + item?.poojaId.image }}
        //         style={{
        //             height: "100%", width: SCREEN_WIDTH * 0.46, borderTopLeftRadius: 10,
        //             borderBottomLeftRadius: 10
        //         }}
        //         resizeMode="cover"
        //     />
        //     <View style={styles.box}>
        //         <Text style={{ color: "white", fontSize: getFontSize(1.5), fontWeight: "500" }}>{item?.poojaId.pujaName}</Text>
        //         <Text style={{ color: "white", fontSize: getFontSize(1.5), fontWeight: "500" }}>{"₹" + item?.price}</Text>
        //         <TouchableOpacity style={styles.btn}
        //             // onPress={()=>navigation.navigate('PoojaStatus',{navigation,...item})}
        //             onPress={() => navigation.navigate('bookedPoojaDetails', { item })}
        //         >
        //             <Text style={{ textAlign: "center", color: "black", fontSize: getFontSize(1.4), fontWeight: "500", elevation: 4 }}>{item?.status}</Text>
        //         </TouchableOpacity>
        //     </View>
        // </View>
    );
    return (
        <View style={styles.list}>
            <FlatList
                data={bookpujaHistoryData}
                // contentContainerStyle={{ paddingBottom: SCREEN_WIDTH *0.4, }}
                renderItem={renderItem}
                // keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
            />
            <View style={{paddingVertical:30,}}></View>
        </View>
    )
}



const styles = StyleSheet.create({
    header: {
        backgroundColor: "#F3604C",
        paddingVertical: SCREEN_HEIGHT * 0.02,
        flexDirection: "row",
        paddingHorizontal: SCREEN_WIDTH * 0.06
    },
    dt: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        borderBottomWidth: 1.9,
        borderBlockColor: "#D3D3D3",
        paddingRight: SCREEN_WIDTH * 0.03
    },
    button: {
        backgroundColor: "white",
        paddingHorizontal: SCREEN_WIDTH * 0.1,
        borderRadius: 100,
        paddingVertical: SCREEN_WIDTH * 0.016
    },
    list: {
        flex: 1,
        // alignItems: "center", 
        marginTop: "3%",
        paddingHorizontal:20,
    },
    banner: {
        marginBottom: 10,
        flexDirection: "row",
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        width: "100%",
    },
    carouselItem: {
        // marginHorizontal: 10,
        // borderRadius: 10,
        // overflow: 'hidden', 
    },
    box: {
        paddingVertical: SCREEN_HEIGHT * 0.03,
        paddingHorizontal: SCREEN_WIDTH * 0.06,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#F3604C",
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },
    pujaMainContainer:{
        backgroundColor: "#F3604C",
        display:"flex",
        flexDirection:"row",
        gap:10,
        alignItems:"center",
        marginBottom:10,
      borderRadius:10,
    },
    btn: {
        backgroundColor: "white",
        paddingVertical: SCREEN_WIDTH * 0.016,
        paddingHorizontal: SCREEN_WIDTH * 0.03,
        borderRadius: 100,
        width:100,
    }
})


const mapStateToProps = state => ({
    newPoojaData: state.pooja.newPoojaData,
    bookpujaHistoryData: state.pooja.newPoojaData,
    customerData: state.customer.customerData,
    bookpujaHistoryData: state.pooja.bookpujaHistoryData
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(PoojaList);

