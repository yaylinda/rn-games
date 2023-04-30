import {FontAwesome5} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BlurView} from 'expo-blur';
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import FivesScreen from './screens/fives/FivesScreen';
import SettingsScreen from './screens/settings/SettingsScreen';
import SlideScreen from './screens/slide/SlideScreen';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NavigatorScreenParams} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type TabStackParamList = {
    Fives: undefined,
    Slide: undefined,
    Settings: undefined,
}

export type AppStackParamList = {
    Tab: NavigatorScreenParams<TabStackParamList>,
}

export type TabStackScreenProps<T extends keyof TabStackParamList>
    = BottomTabScreenProps<TabStackParamList, T>;

export type AppStackScreenProps<T extends keyof AppStackParamList>
    = NativeStackScreenProps<AppStackParamList, T>

const TabStack = createBottomTabNavigator<TabStackParamList>();
const AppStack = createNativeStackNavigator();

const TabStackNavigator = () => {

    return (
        <TabStack.Navigator
            screenOptions={({route}) => ({
                tabBarLabel: () => {
                    return (
                        <Text>{route.name}</Text>
                    );
                },
                tabBarIcon: ({ size, color}) => {
                    let iconName;

                    switch (route.name) {
                    case 'Fives':
                        iconName = 'server';
                        break;
                    case 'Slide':
                        iconName = 'chart-area';
                        break;
                    case 'Settings':
                        iconName = 'cog';
                        break;
                    }

                    return (
                        <FontAwesome5
                            name={iconName}
                            size={size}
                            color={color}
                        />
                    );
                },
                tabBarStyle: {
                    position: 'absolute',
                    paddingTop: 8,
                },
                tabBarBackground: () => (
                    <BlurView
                        tint="dark"
                        intensity={50}
                        style={StyleSheet.absoluteFill}
                    />
                ),
            })}
        >
            <TabStack.Screen
                name="Fives"
                options={{headerShown: false}}
                component={FivesScreen}
            />
            <TabStack.Screen
                name="Slide"
                options={{headerShown: false}}
                component={SlideScreen}
            />
            <TabStack.Screen
                name="Settings"
                options={{headerShown: false}}
                component={SettingsScreen}
            />
        </TabStack.Navigator>
    );
};

export const AppStackNavigator = () => {
    return (
        <AppStack.Navigator>
            <AppStack.Screen
                name="Tab"
                options={{headerShown: false}}
                component={TabStackNavigator}
            />
        </AppStack.Navigator>
    );
};
