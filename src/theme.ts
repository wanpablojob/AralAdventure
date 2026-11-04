import { Platform } from 'react-native';

export const colors = {
  background: '#101828',
  surface: '#1D2939',
  surfaceLight: '#344054',
  border: '#475467',
  text: '#F9FAFB',
  muted: '#98A2B3',
  primary: '#FDB022',
  primaryDark: '#B54708',
  success: '#32D583',
  danger: '#F04438',
  info: '#7A5AF8',
  white: '#FFFFFF',
  black: '#000000',
};

export const pixelFont = Platform.select({
  ios: 'Courier',
  android: 'monospace',
  default: 'monospace',
});
