const BASE_URL = 'https://rickandmortyapi.com/api/character';

const getList = async (page: number, str?: string) => {
  const params = `?page=${page}&status=${str}`;
  const res = await fetcher(params);
  return res;
};

const getDetails = async (id: string) => {
  const params = `${id}`;
  const res = await fetcher(params);
  return res;
};

const fetcher = async (params: string) => {
  const response = await fetch(`${BASE_URL}/${params}`);
  if (response.status === 200) {
    const data = await response.json();
    return data;
  }
  return response.status;
};

export { getList, getDetails };
