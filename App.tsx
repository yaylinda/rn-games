import {NavigationContainer} from '@react-navigation/native';

import React from 'react';
import {AppStackNavigator} from './src/navigators';

export default function App() {
    return (
        <NavigationContainer>
            <AppStackNavigator/>
        </NavigationContainer>
    );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });
