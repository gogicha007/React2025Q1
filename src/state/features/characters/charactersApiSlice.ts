import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ICharacterDetails, IResponse } from '../../../types/interface';

export const characterApiSlice = createApi({
  reducerPath: 'charachters',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://rickandmortyapi.com/api/character',
  }),
  keepUnusedDataFor: 300,
  endpoints: (builder) => {
    return {
      getList: builder.query<IResponse, { page: number; status?: string }>({
        query: ({ page = 1, status='' }) => {
          let queryString = `?page=${page}`
          if(status) {
            queryString += `&status=${status}`
          }
          return queryString
        },
        serializeQueryArgs: ({ queryArgs }) => {
          const { page, status = '' } = queryArgs;
          return `page=${page}&status=${status}`;
        },
      }),
      getDetails: builder.query<ICharacterDetails, { id: string }>({
        query: ({ id }) => `/${id}`,
      }),
    };
  },
});

export const { useGetListQuery, useGetDetailsQuery } = characterApiSlice;
