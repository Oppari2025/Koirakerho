/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#111111', // Dark text for better contrast
    background: '#F5E9DA', // Golden Taupe (light background)
    tint: '#C2B280', // Golden Taupe
    icon: '#A89F91', // Muted taupe
    tabIconDefault: '#A89F91',
    tabIconSelected: '#C2B280',
    accent: '#FFD700', // Gold accent
    border: '#E6D3B3', // Light taupe border
    card: '#E6D3B3', // Card background
    white: '#FFFFFF',
    black: '#000000',
    gray: '#A89F91',
  },
  dark: {
    text: '#F5E9DA', // Light taupe text
    background: '#3B2F2F', // Taupe (dark background)
    tint: '#FFD700', // Gold accent
    icon: '#C2B280', // Golden Taupe
    tabIconDefault: '#C2B280',
    tabIconSelected: '#FFD700',
    accent: '#FFD700',
    border: '#A89F91',
    card: '#A89F91',
    white: '#FFFFFF',
    black: '#000000',
    gray: '#E6D3B3',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
