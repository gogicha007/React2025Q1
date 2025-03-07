import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ICharacterDetails, IResponse } from '~/types/interface';

export const characterApiSlice = createApi({
  reducerPath: 'charachters',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://rickandmortyapi.com/api/character',
  }),
  endpoints: (builder) => {
    return {
      getList: builder.query<IResponse, { page: number; status?: string }>({
        query: ({ page, status }) => `?page=${page}&status=${status}`,
      }),
      getDetails: builder.query<ICharacterDetails, { id: string }>({
        query: ({ id }) => `/${id}`,
      }),
    };
  },
});

export const { useGetListQuery, useGetDetailsQuery } = characterApiSlice;
