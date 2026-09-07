import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export { width, height };

export const APPS_PER_PAGE = 20; // 4 columns x 5 rows
export const COLUMN_COUNT = 4;
export const ICON_SIZE = 58;
export const GRID_PADDING_H = 16;
export const AVAILABLE_WIDTH = width - GRID_PADDING_H * 2;
export const ITEM_WIDTH = AVAILABLE_WIDTH / COLUMN_COUNT;
