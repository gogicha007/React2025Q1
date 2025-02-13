import { TextDecoder, TextEncoder } from 'util';
import 'cross-fetch/polyfill';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
