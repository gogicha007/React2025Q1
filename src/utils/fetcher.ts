import { IFResponse } from '../types/interface';

const BASE_URL = 'https://rickandmortyapi.com/api/character';

const getList = async (str: string, page = 1): Promise<IFResponse | number> => {
  if (!str) return 404;
  const response = await fetch(`${BASE_URL}/?page=${page}&status=${str}`);
  if (response.status === 200) {
    const data = await response.json();
    return data;
  }
  return response.status;
};

export { getList };
