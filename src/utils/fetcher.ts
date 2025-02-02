import { IFResponse } from '../types/interface';

const BASE_URL = 'https://rickandmortyapi.com/api/character';

const getList = async (
  page: number,
  str: string
): Promise<IFResponse | number> => {
  if (!str) return 404;
  const response = await fetch(`${BASE_URL}/?page=${page}&status=${str}`);
  if (response.status === 200) {
    const data = await response.json();
    console.log(data);
    return data;
  }
  return response.status;
};

const getDetails = async (id: string) => {
  const response = await fetch(
    `https://rickandmortyapi.com/api/character/${id}`
  );
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw Error('Could not found charachter details');
  }
};

export { getList, getDetails };
