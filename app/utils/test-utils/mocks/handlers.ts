import { http, HttpResponse } from 'msw';
import {
  mockData,
  mockDataP2,
  mockDetails,
  // mockReduxData,
} from './mock_data';

const BASE_URL = 'https://rickandmortyapi.com/api/character';
const PARAMS = '?page=1&status=alive';
const PARAMS_P2 = '?page=2&status=alive';
export const handlers = [
  http.get(`${BASE_URL}/${PARAMS}`, async () => {
    return HttpResponse.json(mockData, { status: 200 });
  }),
  http.get(`${BASE_URL}/${PARAMS_P2}`, async () => {
    return HttpResponse.json(mockDataP2, { status: 200 });
  }),
  http.get(`${BASE_URL}/1`, async () => {
    return HttpResponse.json(mockDetails, { status: 200 });
  }),
];
