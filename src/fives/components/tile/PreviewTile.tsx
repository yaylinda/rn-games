import {START_NUM_2, START_NUM_3} from '../../utils/constants';
import {View} from 'react-native';
import React from 'react';
import {DEFAULT, SMALL_TILE_WITH_BORDER, SMALL_TILE_WITHOUT_BORDER, STYLES} from './common';

/**
 *
 * @param param0
 * @returns
 */
export const PreviewTile = ({value}: { value: number }) => {
    const isStartNum = value === START_NUM_2 || value === START_NUM_3;

    return (
        <View
            style={[
                DEFAULT,
                STYLES[`tile_${value}`],
                isStartNum ? SMALL_TILE_WITHOUT_BORDER : SMALL_TILE_WITH_BORDER,
            ]}
        />
    );
};

export default PreviewTile;
