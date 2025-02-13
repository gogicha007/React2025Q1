import { http, HttpResponse } from 'msw';
import {
  mockData,
  // mockDataP2,
  // mockDetails,
  // mockReduxData,
} from './mock_data';

const BASE_URL = 'https://rickandmortyapi.com/api/character';
const PARAMS = '?page=1&status=alive';

export const handlers = [
  http.get(`${BASE_URL}/${PARAMS}`, async () => {
    return HttpResponse.json(mockData, { status: 200 });
  }),
];
