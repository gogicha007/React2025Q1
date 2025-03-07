import { TextDecoder, TextEncoder } from 'util';
import 'whatwg-fetch';
import fetch from 'node-fetch';
import '@testing-library/jest-dom';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.fetch = fetch;