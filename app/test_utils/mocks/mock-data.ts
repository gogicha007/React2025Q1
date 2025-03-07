export const mockData = {
  info: {
    count: 200,
    next: 'https://rickandmortyapi.com/api/character/?page=2&status=Alive',
    pages: 15,
    prev: null,
  },
  results: [
    { id: 1, name: 'card 1', status: 'alive' },
    { id: 2, name: 'card 2', status: 'alive' },
    { id: 3, name: 'card 3', status: 'alive' },
    { id: 4, name: 'card 4', status: 'alive' },
    { id: 5, name: 'card 5', status: 'alive' },
    { id: 6, name: 'card 6', status: 'alive' },
  ],
};

export const mockDataP2 = {
  info: {
    count: 200,
    next: 'https://rickandmortyapi.com/api/character/?page=3&status=Alive',
    pages: 15,
    prev: 'https://rickandmortyapi.com/api/character/?page=1&status=Alive',
  },
  results: [
    { id: 7, name: 'card 7', status: 'alive' },
    { id: 8, name: 'card 8', status: 'alive' },
    { id: 9, name: 'card 9', status: 'alive' },
    { id: 10, name: 'card 10', status: 'alive' },
    { id: 11, name: 'card 11', status: 'alive' },
    { id: 12, name: 'card 12', status: 'alive' },
  ],
};

export const mockNoData = {
  info: {
    count: 0,
    next: '',
    pages: 0,
    prev: '',
  },
  results: [],
};

export const mockReduxData = {
  info: {
    count: 1,
    pages: 1,
    next: 'mock-url',
    prev: null,
  },
  results: [
    {
      id: 1,
      name: 'Test Card',
      image: 'test-image.jpg',
      species: 'Test',
      status: 'Alive',
    },
  ],
};

export const mockCharacter = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  image: 'https://images/rick.jpg',
  origin: {
    name: 'details 1',
  },
  location: {
    name: 'location 1',
  },
};
