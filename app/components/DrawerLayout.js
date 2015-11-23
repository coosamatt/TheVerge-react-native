/**
 * Created by mars on 2015/10/11.
 */

'use strict';

import React, {
    Component,
    Dimensions,
    DrawerLayoutAndroid,
    StyleSheet,
    ScrollView,
    View,
    ListView,
    Image,
    Text,
    TouchableHighlight,
}
from 'react-native';

import { connect } from 'react-redux/native';


import Toolbar from './Toolbar';
import DrawerHeader from './header/DrawerHeader';
import Colors from '../utilities/Colors';
import Categories from '../constants/Categories';
import Category from './home/Category';
import Types from '../constants/ActionTypes';


var DRAWER_WIDTH_LEFT =  Dimensions.get('window').width  / 4;
var DEVICE_HEIGHT = require('Dimensions').get('window').height;

export default class DrawerLayout extends Component {

    constructor(props) {
        super(props);
        this._handleScreenSelected = this._handleScreenSelected.bind(this);
        this._renderNavigationItem = this._renderNavigationItem.bind(this);
        this._renderNavigationView = this._renderNavigationView.bind(this);
    }

    componentDidUpdate() {
        let {drawerState} = this.props.state;
        if (drawerState.isDrawerOpen)
            this.drawer.openDrawer();
    }

    _handleScreenSelected(item) {
        let {dispatch} = this.props;
        this.selected = item;
        this.drawer.closeDrawer();
        dispatch({ type: Types.FEED_LOADING,  selected: item });
    }

    _renderNavigationItem(item) {

        let selected = this.props.state.postsState.selected ? this.props.state.postsState.selected.name : '';
        let itemStyle = item.name == selected ? [styles.navHolder, styles.active] :  styles.navHolder;
        let itemTextStle = item.name == selected ? [styles.nav, styles.navTextActive] :  styles.nav;
        let itemIconStle = item.name == selected ? [styles.navIcon, styles.navIconActive] :  styles.navIcon;

        return (
            <TouchableHighlight
                underlayColor={Colors.LightGrey}
                style={styles.navItem}
                onPress={() => this._handleScreenSelected(item)}>
                    <View style={itemStyle}>
                        <Image style={itemIconStle} source={item.icon} />
                        <Text numberOfLines={1} style={itemTextStle}>{item.name}</Text>
                    </View>
            </TouchableHighlight>
        );
    }

    _renderNavigation() {
        return (
            <View>
                <Toolbar {...this.props}>
                </Toolbar>
                <Category {...this.props} />
            </View>
        );
    }

    _renderNavigationView() {
        return (
            <ScrollView style={styles.container}>
                <DrawerHeader />
                <ListView style={styles.navigationList}
                    dataSource={dataSource.cloneWithRows(Categories)}
                    renderRow={this._renderNavigationItem}
                />
            </ScrollView>
        );
    }

    render() {
        return (
            <DrawerLayoutAndroid
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                drawerWidth={Dimensions.get('window').width - DRAWER_WIDTH_LEFT}
                keyboardDismissMode="on-drag"
                ref={(drawer) => { this.drawer = drawer; }}
                renderNavigationView={this._renderNavigationView}>
                {this._renderNavigation(this)}
            </DrawerLayoutAndroid>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.MainBackground,
    },
    navigationList: {
        height: DEVICE_HEIGHT
    },
    navHolder: {
       flexDirection: 'row',
       paddingLeft: 20,
       paddingTop: 20,
       paddingBottom: 20
    },
    navIcon: {
        width: 16,
        height: 16,
        tintColor: Colors.Tint,
        borderRadius: 1
    },
    nav: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 10
    },
    active: {
        backgroundColor: Colors.Highlight
    },
    navTextActive: {
        color: Colors.White
    },
    navIconActive: {
        tintColor: Colors.White
    }
});

var dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});
